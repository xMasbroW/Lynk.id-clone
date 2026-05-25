import { supabase } from '../lib/supabase';
import { swrCache } from '../utils/cache';

export const adminService = {
  async getDashboardMetrics() {
    return swrCache.fetch('admin_metrics', async () => {
      // In production, this would be an RPC call returning aggregated data
      // For this implementation without full backend privileges, we simulate the aggregation logic that the RPC would return.
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: linksCount } = await supabase.from('links').select('*', { count: 'exact', head: true });

      const { data: viewsData } = await supabase.from('analytics_daily_snapshots').select('views');
      const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

      return {
        totalUsers: usersCount || 0,
        activeLinks: linksCount || 0,
        platformViews: totalViews
      };
    }, 60000); // 1 minute cache for admin stats
  },

  async checkAdminStatus(userId) {
     return swrCache.fetch(`admin_status_${userId}`, async () => {
         // Placeholder for RBAC logic. E.g. check a `roles` table.
         // For now, hardcode based on safe assumptions since we are missing full RBAC tables.
         return true; // We rely on the frontend email check for the demo, real app would verify here.
     }, 300000);
  }
};
