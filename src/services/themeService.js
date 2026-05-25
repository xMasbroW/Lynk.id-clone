import { supabase } from '../lib/supabase';
import { swrCache } from '../utils/cache';

export const themeService = {
  async getTheme(userId) {
    return swrCache.fetch(`theme_user_${userId}`, async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    }, 60000); // 1 min TTL
  },

  async updateTheme(userId, updates) {
    const { data, error } = await supabase
      .from('themes')
      .update({ ...updates, updated_at: new Date() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToTheme(userId, callback) {
    return supabase
      .channel(`public:themes:user_id=eq.${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'themes', filter: `user_id=eq.${userId}` }, callback)
      .subscribe();
  }
};
