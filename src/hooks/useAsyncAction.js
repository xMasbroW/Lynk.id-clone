import { useState, useCallback } from 'react';
import { logger } from '../lib/logger';
import toast from 'react-hot-toast';

/**
 * Advanced wrapper for asynchronous UI actions (like form submissions or button clicks).
 * Handles loading states, prevents double-submits, generates correlation trace IDs,
 * and centrally logs errors.
 */
export const useAsyncAction = (actionFn) => {
  const [isPending, setIsPending] = useState(false);

  const execute = useCallback(async (...args) => {
    if (isPending) return;

    setIsPending(true);
    const traceId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    logger.info(`Starting async action`, { traceId, action: actionFn.name || 'anonymous' });

    try {
      const result = await actionFn(...args);
      logger.info(`Completed async action`, { traceId });
      return result;
    } catch (error) {
      logger.error(error, { traceId, action: actionFn.name || 'anonymous' });
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
      throw error; // Re-throw if the component needs to handle it locally
    } finally {
      setIsPending(false);
    }
  }, [actionFn, isPending]);

  return { execute, isPending };
};
