import { queueManager } from '../queue/queueManager.js';
import { logger } from '../logger.js';

class Scheduler {
  constructor() {
    this.cronJobs = new Map();
  }

  /**
   * Register a cron job
   * @param {string} name
   * @param {string} cronExpression (e.g. '0 0 * * *' for daily)
   * @param {Function} handler
   */
  register(name, cronExpression, handler) {
    // In a real distributed system, we would parse cronExpression
    // and use a central DB lock to execute.
    // For this prototype, we'll store the definition and rely on an external trigger
    // (like Edge Function cron) or an internal basic interval for demonstration.
    this.cronJobs.set(name, { cronExpression, handler });
    logger.info(`Registered scheduled job: ${name} with schedule ${cronExpression}`);
  }

  /**
   * Schedule a delayed one-off job
   * @param {string} queueName
   * @param {string} jobType
   * @param {Object} payload
   * @param {number} delayMs
   */
  async scheduleDelayed(queueName, jobType, payload, delayMs) {
    logger.info(`Scheduling delayed job ${jobType} in ${delayMs}ms`);
    return await queueManager.enqueue(queueName, jobType, payload, { delay: delayMs });
  }

  /**
   * Trigger a specific cron job manually or via external orchestrator
   * @param {string} name
   */
  async triggerCron(name) {
    const job = this.cronJobs.get(name);
    if (!job) {
      logger.warn(`Cron job ${name} not found`);
      return;
    }

    logger.info(`Triggering cron job: ${name}`);
    try {
      await job.handler();
    } catch (error) {
      logger.error(`Error executing cron job ${name}`, error);
    }
  }
}

export const scheduler = new Scheduler();
