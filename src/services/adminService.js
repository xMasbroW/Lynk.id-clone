import { supabase } from '../lib/supabase';
import { swrCache } from '../utils/cache';

export const adminService = {
  async getDashboardMetrics() {
    return swrCache.fetch('admin_metrics', async () => {
      // In a scaled production environment, this is returned by an indexed RPC call.

      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: linksCount } = await supabase.from('links').select('*', { count: 'exact', head: true });

      const { data: viewsData } = await supabase.from('analytics_daily_snapshots').select('views');
      const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

      // Revenue Metrics
      const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .neq('plan_id', 'free');

      const { count: churnedSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true })
        .eq('status', 'canceled')
        .neq('plan_id', 'free');

      // Extremely basic MRR estimation assuming $10/mo for PRO
      const mrr = (activeSubs || 0) * 10;

      const churnRate = (activeSubs || 0) > 0
        ? (((churnedSubs || 0) / ((activeSubs || 0) + (churnedSubs || 0))) * 100).toFixed(1)
        : 0;

      return {
        totalUsers: usersCount || 0,
        activeLinks: linksCount || 0,
        platformViews: totalViews,
        activeSubscriptions: activeSubs || 0,
        mrr: mrr,
        churnRate: churnRate
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
