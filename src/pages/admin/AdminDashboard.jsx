import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { platformConfig } from '../../lib/config';
import { adminService } from '../../services/adminService';
import { Navigate } from 'react-router-dom';
import { FaUsers, FaLink, FaChartLine, FaDollarSign, FaCrown, FaHeartBroken } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeLinks: 0,
    platformViews: 0,
    activeSubscriptions: 0,
    mrr: 0,
    churnRate: 0
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    // Basic RBAC guard check
    const checkAdmin = async () => {
      // Temporary basic heuristic. In reality, call adminService.checkAdminStatus(user.id)
      if (user?.email?.endsWith('@lynk.id') || user?.email === 'admin@example.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      const fetchMetrics = async () => {
        try {
           const data = await adminService.getDashboardMetrics();
           setMetrics(data);
        } catch (error) {
           console.error("Failed to load admin metrics", error);
        } finally {
           setLoadingMetrics(false);
        }
      };
      fetchMetrics();
    }
  }, [isAdmin]);

  if (isAdmin === null) return <div className="min-h-screen bg-[var(--color-app-bg)] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--color-app-border)] border-t-[var(--color-app-text)] rounded-full animate-spin"></div></div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] text-[var(--color-app-text)] p-8">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Platform Operations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-2">
           <div className="flex items-center gap-2 text-[var(--color-app-text-muted)]">
             <FaUsers /> <span className="text-sm font-medium">Total Users (DAU)</span>
           </div>
           <span className="text-3xl font-bold">{loadingMetrics ? '-' : metrics.totalUsers.toLocaleString()}</span>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-2">
           <div className="flex items-center gap-2 text-[var(--color-app-text-muted)]">
             <FaLink /> <span className="text-sm font-medium">Active Links</span>
           </div>
           <span className="text-3xl font-bold">{loadingMetrics ? '-' : metrics.activeLinks.toLocaleString()}</span>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-2">
           <div className="flex items-center gap-2 text-[var(--color-app-text-muted)]">
             <FaChartLine /> <span className="text-sm font-medium">Platform Views</span>
           </div>
           <span className="text-3xl font-bold">{loadingMetrics ? '-' : metrics.platformViews.toLocaleString()}</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-2 border border-emerald-500/20">
           <div className="flex items-center gap-2 text-emerald-500 font-medium">
             <FaDollarSign /> <span className="text-sm">MRR Estimation</span>
           </div>
           <span className="text-3xl font-bold text-emerald-500">{loadingMetrics ? '-' : `$${metrics.mrr.toLocaleString()}`}</span>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-2">
           <div className="flex items-center gap-2 text-[var(--color-app-text-muted)]">
             <FaCrown /> <span className="text-sm font-medium">Active Subscriptions</span>
           </div>
           <span className="text-3xl font-bold">{loadingMetrics ? '-' : metrics.activeSubscriptions.toLocaleString()}</span>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-2">
           <div className="flex items-center gap-2 text-[var(--color-app-text-muted)]">
             <FaHeartBroken /> <span className="text-sm font-medium">Churn Rate</span>
           </div>
           <span className="text-3xl font-bold text-red-400">{loadingMetrics ? '-' : `${metrics.churnRate}%`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-3xl">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Kill Switches</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[var(--color-app-border)] pb-2">
              <span>Registrations</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${platformConfig.features.enableRegistration ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {platformConfig.features.enableRegistration ? 'ONLINE' : 'LOCKED'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-app-border)] pb-2">
              <span>Billing Engine</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${platformConfig.features.enableBilling ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {platformConfig.features.enableBilling ? 'ONLINE' : 'BYPASS'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="flex flex-col gap-4 text-sm text-[var(--color-app-text-muted)]">
            <div className="flex items-center justify-between">
              <span>API Gateway</span>
              <span className="text-green-500 font-medium">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Storage Buckets</span>
              <span className="text-green-500 font-medium">Healthy</span>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-app-border)]">
              <p className="text-yellow-500 font-medium">Platform version: {platformConfig.version}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}