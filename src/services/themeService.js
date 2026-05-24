import { supabase } from '../lib/supabase';

export const themeService = {
  async getTheme(userId) {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
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
  }
};
