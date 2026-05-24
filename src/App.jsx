import { useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import ProfileCard from './components/ProfileCard';
import LinkButton from './components/LinkButton';
import SocialIcons from './components/SocialIcons';
import BottomCTA from './components/BottomCTA';
import TopNav from './components/TopNav';
import ProfileEditor from './components/dashboard/ProfileEditor';
import LinkEditor from './components/dashboard/LinkEditor';

function App() {
  const { profile, links, isEditMode, theme } = useAppContext();

  // Apply theme to body globally for the scalable theming system
  useEffect(() => {
    if (theme.mode === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme.mode]);

  return (
    <div className="min-h-screen pb-36 relative overflow-x-hidden font-sans">

      {/* Top Navigation / Dashboard Toggle */}
      <TopNav />

      {/* High-End Dynamic Ambient Background (Hidden in Edit mode for cleaner workspace) */}
      {!isEditMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000">
          <div className="absolute top-[-15%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(63,63,70,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[80px] opacity-70"></div>
          <div className="absolute top-[20%] right-[-30%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(39,39,42,0.1)_0%,rgba(0,0,0,0)_60%)] blur-[100px] animate-[float_15s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-20%] left-[10%] w-[90vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(24,24,27,0.4)_0%,rgba(0,0,0,0)_70%)] blur-[120px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-app-bg)] via-transparent to-[var(--color-app-bg)] opacity-80 mix-blend-overlay"></div>
          <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        </div>
      )}

      {/* Main container */}
      <main className="max-w-2xl mx-auto px-5 sm:px-8 w-full relative z-10 flex flex-col pt-24 sm:pt-28">

        {isEditMode ? (
          /* Dashboard Workspace */
          <div className="animate-fade-in flex flex-col gap-8 w-full">
            <ProfileEditor />
            <LinkEditor />
          </div>
        ) : (
          /* Profile Preview Workspace */
          <>
            <div className="cinematic-enter">
              <ProfileCard
                name={profile.name}
                bio={profile.bio}
                avatarUrl={profile.avatarUrl}
                verified={profile.verified}
              />
            </div>

            <div className="w-full flex flex-col gap-3.5 mt-10 cinematic-enter delay-200">
              {links.filter(link => link.isActive).map((link, index) => (
                <div key={link.id} className={`cinematic-enter delay-${Math.min((index + 3) * 100, 500)}`}>
                  <LinkButton
                    id={link.id}
                    title={link.title}
                    subtitle={link.subtitle}
                    url={link.url}
                    iconKey={link.iconKey}
                    featured={link.featured}
                    isActive={link.isActive}
                  />
                </div>
              ))}
            </div>

            <div className="mt-14 cinematic-enter delay-500 flex justify-center pb-8">
              <SocialIcons />
            </div>
          </>
        )}
      </main>

      {/* Floating dock CTA area (Only show in preview) */}
      {!isEditMode && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none cinematic-enter delay-500">
          <BottomCTA />
        </div>
      )}
    </div>
  );
}

export default App;
