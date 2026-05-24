import { supabase } from '../lib/supabase';

export const profileService = {
  async isUsernameAvailable(username) {
    const reservedWords = ['admin', 'login', 'register', 'dashboard', 'settings', 'api', 'help', 'support', 'support', 'about', 'contact', 'terms', 'privacy'];

    if (reservedWords.includes(username.toLowerCase())) {
      return false;
    }

    // sanitize string - only letters, numbers, underscores, and hyphens
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      throw new Error('Username can only contain letters, numbers, hyphens, and underscores.');
    }

    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('username', username.toLowerCase());

    if (error) throw error;
    return count === 0;
  },

  async getProfileByUsername(username) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  },

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToProfile(userId, callback) {
    return supabase
      .channel(`public:profiles:id=eq.${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, callback)
      .subscribe();
  }
};
