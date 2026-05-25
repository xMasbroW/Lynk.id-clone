import { dispatcher } from './eventDispatcher.js';
import { EVENTS } from './eventRegistry.js';
import { logger } from '../logger.js';

// Example subscriber initialization
export function initializeSubscribers() {
  logger.info('Initializing event subscribers...');

  dispatcher.subscribe(EVENTS.USER_CREATED, async (payload) => {
    logger.info('Handling USER_CREATED event', payload);
    // TODO: Trigger onboarding email job, set up default workspace, etc.
  });

  dispatcher.subscribe(EVENTS.SUBSCRIPTION_CHANGED, async (payload) => {
    logger.info('Handling SUBSCRIPTION_CHANGED event', payload);
    // TODO: Update entitlements, send notification
  });

  dispatcher.subscribe(EVENTS.WORKFLOW_FAILED, async (payload) => {
    logger.error('Handling WORKFLOW_FAILED event', null, payload);
    // TODO: Alert user, trigger dead letter processing
  });

  // Add more default subscribers as needed
}
