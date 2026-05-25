import { supabase } from '../lib/supabase';
import { swrCache } from '../utils/cache';

export const billingService = {
  /**
   * Fetches the user's active subscription and the joined capabilities of their billing plan.
   * Cached to prevent repeated entitlement checks.
   */
  async getSubscriptionEntitlements(userId) {
    return swrCache.fetch(`billing_entitlements_${userId}`, async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          status,
          current_period_end,
          billing_plans (
            id,
            name,
            max_links,
            has_custom_themes,
            has_analytics
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.warn("Failed to fetch billing entitlements, defaulting to free.", error);
        return {
          status: 'active',
          billing_plans: { id: 'free', name: 'Free', max_links: 5, has_custom_themes: false, has_analytics: false }
        };
      }
      return data;
    }, 120000); // 2 minute TTL for billing status
  },

  /**
   * Example abstraction for future Stripe integration.
   * Would create a Stripe checkout session via Edge Function and return URL.
   */
  async createCheckoutSession() {
    // const { url } = await apiClient.invokeFunction('create-checkout', { priceId });
    // return url;
    throw new Error('Not implemented. Needs Stripe API.');
  },

  /**
   * Example abstraction for managing billing via Stripe Customer Portal.
   */
  async createPortalSession() {
    // const { url } = await apiClient.invokeFunction('create-portal');
    // return url;
    throw new Error('Not implemented. Needs Stripe API.');
  }
};
