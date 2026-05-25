import { supabase } from '../supabase.js';
import { logger } from '../logger.js';
import { dispatcher } from '../events/eventDispatcher.js';
import { EVENTS } from '../events/eventRegistry.js';

class QueueManager {
  /**
   * Enqueue a job to be processed.
   * @param {string} queueName
   * @param {string} jobType
   * @param {Object} payload
   * @param {Object} options - delay, deduplication_id, max_retries
   */
  async enqueue(queueName, jobType, payload, options = {}) {
    try {
      const runAt = options.delay
        ? new Date(Date.now() + options.delay).toISOString()
        : new Date().toISOString();

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          queue_name: queueName,
          job_type: jobType,
          payload,
          status: 'pending',
          run_at: runAt,
          max_retries: options.max_retries || 3,
          deduplication_id: options.deduplication_id || null,
        })
        .select('id')
        .single();

      if (error) {
        // Handle deduplication violation (assuming unique constraint on deduplication_id)
        if (error.code === '23505') {
          logger.warn(`Job deduplication skipped for id: ${options.deduplication_id}`);
          return null;
        }
        throw error;
      }

      logger.info(`Enqueued job ${data.id} of type ${jobType} in queue ${queueName}`);
      return data.id;
    } catch (err) {
      logger.error('Failed to enqueue job', err, { queueName, jobType });
      throw err;
    }
  }

  /**
   * Fetch a batch of pending jobs that are ready to run
   * Uses Postgres row-level locking via an Edge Function/RPC if available,
   * or a basic SELECT ... FOR UPDATE pattern logic wrapped in an RPC.
   */
  async fetchJobs(queueName, limit = 10) {
    try {
      // For distributed safety, this ideally calls a Postgres function
      // that does SELECT ... FOR UPDATE SKIP LOCKED
      // Example RPC call:
      const { data, error } = await supabase.rpc('fetch_pending_jobs', {
        p_queue_name: queueName,
        p_limit: limit
      });

      if (error) throw error;
      return data || [];
    } catch (err) {
      logger.error(`Failed to fetch jobs for queue ${queueName}`, err);
      return [];
    }
  }

  /**
   * Mark a job as completed
   */
  async completeJob(jobId) {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;
      logger.debug(`Job ${jobId} completed`);
    } catch (err) {
      logger.error(`Failed to complete job ${jobId}`, err);
    }
  }

  /**
   * Mark a job as failed, handle retries or dead-lettering
   */
  async failJob(jobId, errorDetail, currentRetries, maxRetries) {
    try {
      if (currentRetries < maxRetries) {
        // Exponential backoff: delay = 2^retries * 1000ms
        const delay = Math.pow(2, currentRetries) * 1000;
        const nextRunAt = new Date(Date.now() + delay).toISOString();

        await supabase
          .from('jobs')
          .update({
            status: 'pending',
            retries: currentRetries + 1,
            run_at: nextRunAt,
            last_error: typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail)
          })
          .eq('id', jobId);

        logger.info(`Job ${jobId} failed, scheduling retry ${currentRetries + 1}/${maxRetries} at ${nextRunAt}`);
      } else {
        // Move to dead-letter queue or mark failed
        await supabase
          .from('jobs')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            last_error: typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail)
          })
          .eq('id', jobId);

        logger.error(`Job ${jobId} max retries reached. Moved to dead-letter state.`);

        // Dispatch job failed event
        await dispatcher.dispatch(EVENTS.JOB_FAILED, { jobId, error: errorDetail });
      }
    } catch (err) {
      logger.error(`Failed to update failure state for job ${jobId}`, err);
    }
  }
}

export const queueManager = new QueueManager();
