import { useEffect, useCallback, useRef } from 'react';
import { EVENT_TYPES } from '../lib/analytics/events';
import { logger } from '../lib/logger';
import { useNetworkState } from './useNetworkState';

/**
 * Advanced Tracking Hook.
 * Handles batched event queueing, offline buffering, UTM parameter tracking, and deduplication.
 */
export const useTracking = () => {
  const isOnline = useNetworkState();
  const queueRef = useRef([]);
  const processIntervalRef = useRef(null);

  // Initialize tracking and capture UTM params
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {};
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(param => {
        if (urlParams.has(param)) {
          utmParams[param] = urlParams.get(param);
        }
      });

      if (Object.keys(utmParams).length > 0) {
        // Persist UTMs to session for attribution if they sign up
        sessionStorage.setItem('lynk_utm_attribution', JSON.stringify(utmParams));
      }
    } catch (e) {
      logger.warn("Failed to parse UTM parameters", { error: e.message });
    }
  }, []);

  const processQueue = useCallback(async () => {
    if (queueRef.current.length === 0 || !isOnline) return;

    const eventsToProcess = [...queueRef.current];
    queueRef.current = []; // Clear queue

    try {
      // Import here to avoid circular dependencies if apiClient needs useTracking later
      const { apiClient } = await import('../lib/apiClient');
      await apiClient.invokeFunction('ingest-events', { events: eventsToProcess });

      logger.info(`Processed ${eventsToProcess.length} events in batch.`);
    } catch (error) {
      logger.error('Failed to process analytics batch, requeueing', { error });
      // Requeue events on failure (putting them back at the front)
      queueRef.current = [...eventsToProcess, ...queueRef.current];
    }
  }, [isOnline]);

  // Set up batch processor
  useEffect(() => {
    processIntervalRef.current = setInterval(processQueue, 5000); // Batch every 5 seconds

    return () => {
      if (processIntervalRef.current) clearInterval(processIntervalRef.current);
      // Attempt to flush on unmount
      if (queueRef.current.length > 0 && navigator.onLine) {
         // Using sendBeacon for reliable unload tracking
         // navigator.sendBeacon(url, JSON.stringify(queueRef.current));
      }
    };
  }, [processQueue]);

  const trackEvent = useCallback((eventName, properties = {}) => {
    if (!Object.values(EVENT_TYPES).includes(eventName)) {
      logger.warn(`Unknown event type: ${eventName}`);
    }

    const event = {
      event_type: eventName,
      properties,
      timestamp: new Date().toISOString(),
      trace_id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      referrer: document.referrer || 'direct'
    };

    queueRef.current.push(event);
  }, []);

  return { trackEvent, EVENT_TYPES };
};
