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
    // Note: In a highly scalable app, you'd use a Postgres function (RPC) or edge function
    // to atomically increment. For now we use RPC if available, or fallback.
    const { data, error } = await supabase.rpc('increment_view', { target_user_id: userId });

    // If RPC not setup, we gracefully fail here rather than read-modify-write on client
    if (error) console.error("Could not record view", error);
    return data;
  },

  async recordClick(userId, linkId) {
    const { data, error } = await supabase.rpc('increment_click', { target_user_id: userId, target_link_id: linkId });
    if (error) console.error("Could not record click", error);
    return data;
  }
};
