import { useAppContext } from '../context/AppContext';
import { FaEdit, FaEye, FaMoon, FaSun } from 'react-icons/fa';

const TopNav = () => {
  const { isEditMode, setIsEditMode, theme, setTheme } = useAppContext();

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark'
    }));
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="glass-panel rounded-full p-1.5 flex items-center gap-2 pointer-events-auto">

        {/* Mode Toggle */}
        <div className="flex bg-[var(--color-app-surface)] rounded-full p-1">
          <button
            onClick={() => setIsEditMode(true)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              isEditMode
                ? 'bg-[var(--color-app-text)] text-[var(--color-app-bg)] shadow-md'
                : 'text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)]'
            }`}
          >
            <FaEdit size={12} />
            Edit
          </button>
          <button
            onClick={() => setIsEditMode(false)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              !isEditMode
                ? 'bg-[var(--color-app-text)] text-[var(--color-app-bg)] shadow-md'
                : 'text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)]'
            }`}
          >
            <FaEye size={12} />
            Preview
          </button>
        </div>

        <div className="w-[1px] h-6 bg-[var(--color-app-border)] mx-1"></div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] hover:bg-[var(--color-app-surface-hover)] transition-all"
        >
          {theme.mode === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
        </button>

      </div>
    </div>
  );
};

export default TopNav;
