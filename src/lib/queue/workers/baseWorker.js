import { queueManager } from '../queueManager.js';
import { logger } from '../../logger.js';

class WorkerClass {
  constructor(queueName, processor, options = {}) {
    this.queueName = queueName;
    this.processor = processor;
    this.concurrency = options.concurrency || 1;
    this.pollInterval = options.pollInterval || 5000;
    this.isRunning = false;
    this.activeJobs = 0;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    logger.info(`Started worker for queue: ${this.queueName}`);
    this.poll();
  }

  stop() {
    this.isRunning = false;
    logger.info(`Stopped worker for queue: ${this.queueName}`);
  }

  async poll() {
    if (!this.isRunning) return;

    if (this.activeJobs >= this.concurrency) {
      setTimeout(() => this.poll(), this.pollInterval);
      return;
    }

    try {
      const availableSlots = this.concurrency - this.activeJobs;
      const jobs = await queueManager.fetchJobs(this.queueName, availableSlots);

      if (jobs.length > 0) {
        jobs.forEach(job => this.processJob(job));
      }
    } catch (err) {
      logger.error(`Worker poll error on queue ${this.queueName}`, err);
      // Graceful degradation: backoff polling slightly if the DB is failing to respond
      setTimeout(() => this.poll(), this.pollInterval * 2);
      return;
    } finally {
      if (this.isRunning) {
         setTimeout(() => this.poll(), this.pollInterval);
      }
    }
  }

  async processJob(job) {
    this.activeJobs++;
    logger.debug(`Processing job ${job.id} of type ${job.job_type}`);

    try {
      await this.processor(job.payload, job);
      await queueManager.completeJob(job.id);
    } catch (error) {
      logger.error(`Error processing job ${job.id}`, error);
      await queueManager.failJob(job.id, error.message || error, job.retries || 0, job.max_retries || 3);
    } finally {
      this.activeJobs--;
    }
  }
}

export const createWorker = (queueName, processor, options) => {
  return new WorkerClass(queueName, processor, options);
};
