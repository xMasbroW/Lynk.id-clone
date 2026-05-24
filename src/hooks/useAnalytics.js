import { useEffect, useCallback } from 'react';

/**
 * Future-ready analytics hook structure.
 * Currently logs to console, but can easily be wired up to PostHog, Mixpanel, Google Analytics, etc.
 */
export const useAnalytics = () => {
  // Setup analytics initialization
  useEffect(() => {
    // e.g., mixpanel.init('YOUR_TOKEN');
    console.log('[Analytics] Initialized');
  }, []);

  const trackEvent = useCallback((eventName, properties = {}) => {
    // Example: send to backend or analytics provider
    // mixpanel.track(eventName, properties);
    console.log(`[Analytics Track] ${eventName}`, properties);
  }, []);

  const trackPageView = useCallback((pageName) => {
    console.log(`[Analytics PageView] ${pageName}`);
  }, []);

  const trackLinkClick = useCallback((linkId, url) => {
    trackEvent('Link Clicked', { linkId, url });
  }, [trackEvent]);

  return { trackEvent, trackPageView, trackLinkClick };
};
