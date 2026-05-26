import { logger } from '../logger.js';

class EventDispatcher {
  constructor() {
    this.subscribers = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventName
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(eventName, callback) {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, new Set());
    }

    this.subscribers.get(eventName).add(callback);

    return () => this.unsubscribe(eventName, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName
   * @param {Function} callback
   */
  unsubscribe(eventName, callback) {
    if (this.subscribers.has(eventName)) {
      this.subscribers.get(eventName).delete(callback);
    }
  }

  /**
   * Dispatch an event asynchronously to all subscribers
   * @param {string} eventName
   * @param {Object} payload
   */
  async dispatch(eventName, payload) {
    logger.debug(`Dispatching event: ${eventName}`, { payload });

    if (!this.subscribers.has(eventName)) {
      return;
    }

    const callbacks = this.subscribers.get(eventName);

    // Execute all callbacks asynchronously and catch errors individually
    // so one failing subscriber doesn't stop others
    const promises = Array.from(callbacks).map(async (callback) => {
      try {
        await callback(payload);
      } catch (error) {
        logger.error(`Error in subscriber for event ${eventName}`, error, { payload });
      }
    });

    await Promise.allSettled(promises);
  }
}

export const dispatcher = new EventDispatcher();
