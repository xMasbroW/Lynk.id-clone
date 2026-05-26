import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { useTracking } from './useTracking';
import toast from 'react-hot-toast';

export const useOnboarding = () => {
  const { user } = useAuth();
  const { trackEvent, EVENT_TYPES } = useTracking();

  const [isOnboarded, setIsOnboarded] = useState(true);
  const [isLoading, setIsLoading] = useState(!!user);

  useEffect(() => {
    let isMounted = true;
    if (!user) {
      return;
    }

    const checkOnboarding = async () => {
      try {
        const profile = await profileService.getProfile(user.id);
        if (isMounted && profile) {
          // If the user hasn't completed setup (e.g. no links or specific flag), we mark as not onboarded.
          // We'll use a local storage flag for the session to prevent repeating it if they skip.
          const hasSkipped = localStorage.getItem(`onboarding_skipped_${user.id}`);
          if (profile.full_name === '' && !hasSkipped) {
            setIsOnboarded(false);
          }
        }
      } catch (err) {
        console.error("Failed to check onboarding state", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const completeOnboarding = useCallback(async (profileUpdates) => {
    if (!user) return;
    try {
      trackEvent(EVENT_TYPES.ONBOARDING_START);

      // Update profile
      if (Object.keys(profileUpdates).length > 0) {
        await profileService.updateProfile(user.id, profileUpdates);
      }

      setIsOnboarded(true);
      trackEvent(EVENT_TYPES.ONBOARDING_COMPLETE);
      toast.success("Welcome to Lynk! Your profile is ready.");
    } catch {
      toast.error("Failed to complete onboarding.");
    }
  }, [user, trackEvent, EVENT_TYPES]);

  const skipOnboarding = useCallback(() => {
    if (user) {
      localStorage.setItem(`onboarding_skipped_${user.id}`, 'true');
    }
    setIsOnboarded(true);
  }, [user]);

  return { isOnboarded, isLoading, completeOnboarding, skipOnboarding };
};
