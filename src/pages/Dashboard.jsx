import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Sidebar from '../components/layout/Sidebar';
import PhonePreview from '../components/layout/PhonePreview';
import MobilePreviewToggle from '../components/layout/MobilePreviewToggle';
import LinkEditor from '../components/dashboard/LinkEditor';
import AnalyticsTab from '../components/dashboard/tabs/AnalyticsTab';
import SettingsTab from '../components/dashboard/tabs/SettingsTab';
import ProfileCard from '../components/ProfileCard';
import LinkButton from '../components/LinkButton';
import SocialIcons from '../components/SocialIcons';
import BottomCTA from '../components/BottomCTA';

function App() {
  const { theme, isEditMode, profile, links } = useAppContext();
  const [activeTab, setActiveTab] = useState('links');

  // Apply theme to body globally for the scalable theming system
  useEffect(() => {
    if (theme.mode === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme.mode]);

  const renderContent = () => {
    switch (activeTab) {
      case 'links':
        return <LinkEditor />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <LinkEditor />;
    }
  };

  // Render Mobile Public View when in Preview Mode
  if (!isEditMode) {
    return (
      <div className="min-h-screen bg-[var(--color-app-bg)] text-[var(--color-app-text)] font-sans transition-colors duration-300 flex flex-col items-center pb-24 relative pt-12 px-5">
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

        <MobilePreviewToggle />

        <div className="w-full max-w-md z-10 animate-fade-in">
          <ProfileCard
            name={profile.name}
            bio={profile.bio}
            avatarUrl={profile.avatarUrl}
            verified={profile.verified}
          />

          <div className="w-full flex flex-col gap-3 mt-8">
            {links.filter(link => link.isActive).map((link) => (
              <LinkButton
                key={link.id}
                id={link.id}
                title={link.title}
                subtitle={link.subtitle}
                url={link.url}
                iconKey={link.iconKey}
                featured={link.featured}
                isActive={link.isActive}
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
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--color-app-bg)] text-[var(--color-app-text)] font-sans transition-colors duration-300">

      {/* Desktop split-pane layout / Mobile stack */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dashboard Working Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar lg:h-screen pb-24 lg:pb-0 relative flex flex-col">

        <MobilePreviewToggle />

        {/* Subtle background noise for texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

        <div className="max-w-3xl w-full mx-auto p-4 sm:p-8 pt-8 sm:pt-12 relative z-10">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Realistic Phone Preview (Desktop Only) */}
      <PhonePreview />

    </div>
  );
}

export default App;
