import { supabase } from '../lib/supabase';
import { swrCache } from '../utils/cache';

export const notificationService = {
  async getUnreadCount(userId) {
    return swrCache.fetch(`notifications_count_${userId}`, async () => {
      // Stub returning 0 since we don't have a notifications table initialized yet
      return 0;
    }, 60000);
  },

  subscribeToNotifications(userId, callback) {
    // Listens to a broadcast channel or a specific notifications table
    return supabase
      .channel(`public:notifications:user_id=eq.${userId}`)
      .on('broadcast', { event: 'notification' }, callback)
      .subscribe();
  }
};
