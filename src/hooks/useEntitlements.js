import { useState, useEffect } from 'react';
import { billingService } from '../services/billingService';
import { useAuth } from '../context/AuthContext';

/**
 * Feature Gating Hook.
 * Resolves permissions and resource limits dynamically based on the server-authoritative billing plan.
 */
export const useEntitlements = () => {
  const { user } = useAuth();
  const [entitlements, setEntitlements] = useState({
    maxLinks: 5,
    hasCustomThemes: false,
    hasAnalytics: false,
    isLoading: !!user
  });

  useEffect(() => {
    let isMounted = true;
    if (!user) {
      return;
    }

    const fetchEntitlements = async () => {
      try {
        const data = await billingService.getSubscriptionEntitlements(user.id);
        if (isMounted && data?.billing_plans) {
          const plan = data.billing_plans;
          // Only grant features if subscription is active or trialing
          const isActive = ['active', 'trialing'].includes(data.status);

          setEntitlements({
            maxLinks: isActive ? plan.max_links : 5, // Fallback to free tier limits if payment failed
            hasCustomThemes: isActive ? plan.has_custom_themes : false,
            hasAnalytics: isActive ? plan.has_analytics : false,
            isLoading: false
          });
        }
      } catch {
        if (isMounted) setEntitlements(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchEntitlements();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return entitlements;
};
