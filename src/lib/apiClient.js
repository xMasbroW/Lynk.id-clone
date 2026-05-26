import { supabase } from './supabase';
import { logger } from './logger';

/**
 * Generates a basic correlation ID for tracing requests across client and server.
 */
const generateCorrelationId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Centralized API Gateway abstraction for invoking Supabase Edge Functions securely.
 * This separates direct DB queries from complex, synchronous or asynchronous server-side workloads.
 */
export const apiClient = {
  /**
   * Invokes an edge function with strict error boundary, logging, and correlation tracking.
   */
  async invokeFunction(functionName, payload = {}) {
    const correlationId = generateCorrelationId();
    logger.info(`Invoking Edge Function: ${functionName}`, { correlationId, payloadKeys: Object.keys(payload) });

    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload,
        headers: {
          'x-correlation-id': correlationId
        }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error(`Edge Function Failed: ${functionName}`, { correlationId, error: error.message || error });
      throw error; // Preserve original caught error to not mask root causes
    }
  }
};
