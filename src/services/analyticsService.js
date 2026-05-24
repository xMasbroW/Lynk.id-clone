import { supabase } from '../lib/supabase';

export const analyticsService = {
  async getAnalytics(userId) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async recordView(userId) {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobi|Android/i.test(userAgent);
    const deviceType = isMobile ? 'mobile' : 'desktop';
    const referrer = document.referrer || 'direct';

    const { data, error } = await supabase.rpc('increment_view', {
      target_user_id: userId,
      device_type: deviceType,
      referrer_url: referrer
    });

    if (error) console.error("Could not record view", error);
    return data;
  },

  async recordClick(userId, linkId) {
    const { data, error } = await supabase.rpc('increment_click', {
      target_user_id: userId,
      target_link_id: linkId
    });
    if (error) console.error("Could not record click", error);
    return data;
  },

  // Prepare billing/admin abstractions (Feature Gating)
  async getUserPlan(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan_type, status, ends_at')
      .eq('user_id', userId)
      .single();

    // Graceful fallback for MVP before billing is fully enforced
    if (error || !data) return { plan_type: 'free', status: 'active' };
    return data;
  }
};
