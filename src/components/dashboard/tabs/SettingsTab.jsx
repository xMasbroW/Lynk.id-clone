import { useAppContext } from '../../../context/AppContext';
import ProfileEditor from '../ProfileEditor';
import { FaMoon, FaSun } from 'react-icons/fa';

const SettingsTab = () => {
  const { theme, setTheme } = useAppContext();

  const toggleTheme = () => {
    setTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in pb-32 lg:pb-8">

      <div className="flex flex-col gap-2 sticky top-0 z-20 bg-[var(--color-app-bg)]/80 backdrop-blur-md py-4 border-b border-transparent">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-app-text)]">Settings</h2>
        <p className="text-sm text-[var(--color-app-text-muted)]">Manage your profile details and appearance.</p>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-semibold text-[var(--color-app-text)] uppercase tracking-wider">Appearance</h3>

        <div className="glass-panel p-5 rounded-3xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-[var(--color-app-text)]">Theme Mode</span>
            <span className="text-xs text-[var(--color-app-text-muted)] mt-1">Switch between light and dark mode.</span>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-app-surface-hover)] text-[var(--color-app-text)] hover:scale-105 active:scale-95 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] border border-[var(--color-app-border)]"
          >
            {theme.mode === 'dark' ? (
              <><FaSun size={12} /> Light Mode</>
            ) : (
              <><FaMoon size={12} /> Dark Mode</>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-semibold text-[var(--color-app-text)] uppercase tracking-wider">Public Profile</h3>
        <ProfileEditor />
      </div>

    </div>
  );
};

export default SettingsTab;
