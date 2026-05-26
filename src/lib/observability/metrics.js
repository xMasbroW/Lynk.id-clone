import { supabase } from '../supabase.js';
import { logger } from '../logger.js';

class ExecutionMetrics {
  async getQueueStats() {
    try {
      // In a real system, you'd run a fast aggregate query or maintain counters.
      // This is a simplified version counting pending jobs.
      const { error, count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      return { pendingJobs: count };
    } catch (err) {
      logger.error('Failed to get queue stats', err);
      return { pendingJobs: 0 };
    }
  }

  async getDeadLetterStats() {
    try {
      const { error, count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed');

      if (error) throw error;
      return { deadLetterJobs: count };
    } catch (err) {
      logger.error('Failed to get dead letter stats', err);
      return { deadLetterJobs: 0 };
    }
  }

  async getWorkflowRunStats() {
      try {
        const { count: runningCount } = await supabase
          .from('automation_runs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'running');

        const { count: failedCount } = await supabase
          .from('automation_runs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'failed');

        return {
            activeWorkflows: runningCount || 0,
            failedWorkflows: failedCount || 0
        };
      } catch (err) {
         logger.error('Failed to get workflow stats', err);
         return { activeWorkflows: 0, failedWorkflows: 0 };
      }
  }
}

export const metrics = new ExecutionMetrics();
