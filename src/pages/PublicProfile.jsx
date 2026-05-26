import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { linkService } from '../services/linkService';
import { themeService } from '../services/themeService';
import { analyticsService } from '../services/analyticsService';
import { useTracking } from '../hooks/useTracking';
import ProfileCard from '../components/ProfileCard';
import LinkButton from '../components/LinkButton';
import SocialIcons from '../components/SocialIcons';
import BottomCTA from '../components/BottomCTA';
import { SEO } from '../components/SEO';

export default function PublicProfile() {
  const { username } = useParams();
  const { trackEvent, EVENT_TYPES } = useTracking();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    profile: null,
    links: [],
    theme: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Safely fetch public data by username
        const profile = await profileService.getProfileByUsername(username);

        if (!profile) {
          throw new Error('Profile not found');
        }

        const [links, theme] = await Promise.all([
          linkService.getLinks(profile.id),
          themeService.getTheme(profile.id)
        ]);

        if (isMounted) {
          setProfileData({ profile, links, theme });

          // Apply theme dynamically to document body for the public view
          if (theme?.mode === 'light') {
            document.body.classList.add('theme-light');
          } else {
            document.body.classList.remove('theme-light');
          }

          if (theme?.background_color) {
            document.documentElement.style.setProperty('--color-app-bg', theme.background_color);
          }
          if (theme?.button_color) {
            document.documentElement.style.setProperty('--color-app-surface', theme.button_color);
            document.documentElement.style.setProperty('--color-app-surface-hover', theme.button_color);
          }
          if (theme?.button_text_color) {
            document.documentElement.style.setProperty('--color-app-text', theme.button_text_color);
          }

          if (theme?.font_family) {
            if (theme.font_family === 'serif') {
              document.body.classList.add('font-serif');
              document.body.classList.remove('font-sans', 'font-mono');
            } else if (theme.font_family === 'mono') {
              document.body.classList.add('font-mono');
              document.body.classList.remove('font-sans', 'font-serif');
            } else {
              document.body.classList.add('font-sans');
              document.body.classList.remove('font-serif', 'font-mono');
            }
          }

          // Record Analytics View silently with a cooldown
          const viewCooldownKey = `view_cooldown_${profile.id}`;
          const lastView = sessionStorage.getItem(viewCooldownKey);
          const now = Date.now();

          // 1 hour cooldown per profile per session to prevent rapid-fire view inflation
          if (!lastView || now - parseInt(lastView, 10) > 3600000) {
            sessionStorage.setItem(viewCooldownKey, now.toString());
            analyticsService.recordView(profile.id).catch(() => {});
            trackEvent(EVENT_TYPES.PROFILE_VIEW, { profile_id: profile.id });
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load profile');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
      document.body.classList.remove('theme-light');
      document.documentElement.style.removeProperty('--color-app-bg');
      document.documentElement.style.removeProperty('--color-app-surface');
      document.documentElement.style.removeProperty('--color-app-surface-hover');
      document.documentElement.style.removeProperty('--color-app-text');
      document.body.classList.remove('font-serif', 'font-mono');
    };
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-app-bg)] flex items-center justify-center p-4" aria-live="polite" aria-busy="true">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 border-2 border-[var(--color-app-border)] border-t-[var(--color-app-text)] rounded-full animate-spin"></div>
          <p className="text-[var(--color-app-text-muted)] font-medium tracking-wide">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData.profile) {
    return (
      <div className="min-h-screen bg-[var(--color-app-bg)] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-[var(--color-app-surface)] text-[var(--color-app-text-muted)] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-10 h-10 text-red-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-app-text)] mb-3 tracking-tight">Profile Not Found</h1>
        <p className="text-[var(--color-app-text-muted)] text-center max-w-sm leading-relaxed">The page you're looking for doesn't exist, has been removed, or the username is incorrect.</p>
        <a href="/" className="mt-8 px-6 py-2.5 bg-[var(--color-app-text)] text-[var(--color-app-bg)] rounded-full font-semibold hover:opacity-90 transition-opacity">Return Home</a>
      </div>
    );
  }

  const { profile, links } = profileData;

  return (
    <>
      <SEO
        title={profile.full_name}
        description={profile.bio || `Check out ${profile.full_name}'s links`}
        image={profile.avatar_url}
        profileName={profile.full_name}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />

      <div className="min-h-screen bg-[var(--color-app-bg)] text-[var(--color-app-text)] font-sans transition-colors duration-300 flex flex-col items-center pb-24 relative pt-12 px-5">
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

        <div className="w-full max-w-md z-10 animate-fade-in">
          <ProfileCard
            name={profile.full_name}
            bio={profile.bio}
            avatarUrl={profile.avatar_url}
            verified={profile.verified}
          />

          <div className="w-full flex flex-col gap-3 mt-8">
            {links.filter(link => link.is_active).map((link) => (
              <LinkButton
                key={link.id}
                id={link.id}
                title={link.title}
                subtitle={link.subtitle}
                url={link.url}
                iconKey={link.icon_key}
                featured={link.featured}
                isActive={link.is_active}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center pb-8">
            <SocialIcons />
          </div>
        </div>

        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <BottomCTA />
        </div>

        {/* Virality Badge */}
        <a
          href={`/?utm_source=profile_badge&utm_medium=referral&utm_campaign=${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 mb-8 text-[11px] font-medium tracking-wide text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] transition-colors uppercase opacity-70 hover:opacity-100 flex items-center gap-1.5"
        >
          Powered by <span className="font-bold">Lynk</span>
        </a>
      </div>
    </>
  );
}