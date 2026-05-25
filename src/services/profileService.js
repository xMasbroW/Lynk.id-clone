import { supabase } from '../lib/supabase';

export const profileService = {
  async isUsernameAvailable(username) {
    // Extensive list of reserved routes and sensitive words to prevent routing collisions and phishing
    const reservedWords = [
      'admin', 'login', 'register', 'dashboard', 'settings', 'api', 'help', 'support',
      'about', 'contact', 'terms', 'privacy', 'root', 'sysadmin', 'security', 'billing',
      'pricing', 'forgot-password', 'reset-password', 'auth', 'oauth', 'blog', 'careers',
      'jobs', 'press', 'media', 'status', 'features', 'product', 'download', 'app', 'assets',
      'static', 'public', 'images', 'styles', 'scripts', 'css', 'js', 'lynkid', 'team'
    ];

    const normalizedUsername = username.toLowerCase();

    if (reservedWords.includes(normalizedUsername)) {
      return false;
    }

    // Restrict length to prevent DB bloat and UI breaking
    if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
      throw new Error('Username must be between 3 and 30 characters.');
    }

    // sanitize string - only letters, numbers, underscores, and hyphens, no consecutive hyphens/underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(normalizedUsername) || /--|__/.test(normalizedUsername)) {
      throw new Error('Username can only contain letters, numbers, hyphens, and underscores without consecutive special characters.');
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
