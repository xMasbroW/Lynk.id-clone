import { useAppContext } from '../../../context/AppContext';
import ProfileEditor from '../ProfileEditor';
import { FaMoon, FaSun } from 'react-icons/fa';

const SettingsTab = () => {
  const { theme, setTheme } = useAppContext();

  const toggleTheme = () => {
    setTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' });
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setTheme({ [name]: value });
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in pb-32 lg:pb-8">

      <div className="flex flex-col gap-2 sticky top-0 z-20 bg-[var(--color-app-bg)]/80 backdrop-blur-md py-4 border-b border-transparent">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-app-text)]">Settings</h2>
        <p className="text-sm text-[var(--color-app-text-muted)]">Manage your profile details and appearance.</p>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-semibold text-[var(--color-app-text)] uppercase tracking-wider">Appearance</h3>

        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-5">
          <div className="flex items-center justify-between">
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

          <div className="w-full h-px bg-[var(--color-app-border)] opacity-50"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[var(--color-app-text-muted)] uppercase tracking-wider">Button Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="button_color"
                  value={theme.button_color || '#ffffff'}
                  onChange={handleColorChange}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <span className="text-sm font-mono bg-[var(--color-app-surface)] px-2 py-1 rounded text-[var(--color-app-text)]">
                  {theme.button_color || 'Default'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[var(--color-app-text-muted)] uppercase tracking-wider">Button Text</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="button_text_color"
                  value={theme.button_text_color || '#000000'}
                  onChange={handleColorChange}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <span className="text-sm font-mono bg-[var(--color-app-surface)] px-2 py-1 rounded text-[var(--color-app-text)]">
                  {theme.button_text_color || 'Default'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[var(--color-app-text-muted)] uppercase tracking-wider">Background Custom</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="background_color"
                  value={theme.background_color || '#0a0a0a'}
                  onChange={handleColorChange}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <span className="text-sm font-mono bg-[var(--color-app-surface)] px-2 py-1 rounded text-[var(--color-app-text)]">
                  {theme.background_color || 'Default'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[var(--color-app-text-muted)] uppercase tracking-wider">Font Style</label>
              <select
                name="font_family"
                value={theme.font_family || 'sans'}
                onChange={handleColorChange}
                className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded text-sm text-[var(--color-app-text)] px-3 py-2.5 outline-none"
              >
                <option value="sans">Modern Sans</option>
                <option value="serif">Elegant Serif</option>
                <option value="mono">Tech Mono</option>
              </select>
            </div>
          </div>
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
