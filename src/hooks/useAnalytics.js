import { useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

/**
 * Production-ready analytics hook with abuse prevention.
 */
export const useAnalytics = () => {
  useEffect(() => {
    console.log('[Analytics] Initialized');
  }, []);

  const trackEvent = useCallback((eventName, properties = {}) => {
    console.log(`[Analytics Track] ${eventName}`, properties);
  }, []);

  const trackPageView = useCallback((pageName) => {
    console.log(`[Analytics PageView] ${pageName}`);
  }, []);

  // Use session storage to prevent a single user from spamming clicks on the same link
  const trackLinkClick = useCallback(async (linkId, targetUserId) => {
    trackEvent('Link Clicked', { linkId });

    if (!targetUserId || !linkId) return;

    const cooldownKey = `click_cooldown_${linkId}`;
    const lastClick = sessionStorage.getItem(cooldownKey);
    const now = Date.now();

    // 5-second cooldown per link per session to prevent rapid-fire abuse
    if (lastClick && now - parseInt(lastClick, 10) < 5000) {
      return;
    }

    sessionStorage.setItem(cooldownKey, now.toString());

    try {
      await analyticsService.recordClick(targetUserId, linkId);
    } catch (err) {
      console.warn("Analytics recording failed", err);
    }
  }, [trackEvent]);

  return { trackEvent, trackPageView, trackLinkClick };
};
