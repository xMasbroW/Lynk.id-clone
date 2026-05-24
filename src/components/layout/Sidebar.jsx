import { FaLink, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const tabs = [
    { id: 'links', label: 'Links', icon: FaLink },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col bg-[var(--color-app-surface)] border-r border-[var(--color-app-border)] backdrop-blur-xl z-30 fixed lg:relative bottom-0 lg:bottom-auto left-0 right-0 lg:h-screen transition-colors duration-300">

      {/* Brand Header - Desktop only */}
      <div className="hidden lg:flex items-center px-6 h-16 border-b border-[var(--color-app-border)]">
        <span className="font-semibold text-[15px] tracking-tight text-[var(--color-app-text)]">Lynk Platform</span>
      </div>

      {/* Navigation */}
      <nav className="flex lg:flex-col lg:p-4 gap-1 overflow-x-auto lg:overflow-visible w-full pb-safe lg:pb-0 hide-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3.5 lg:py-2.5 rounded-xl text-sm font-medium transition-all outline-none ${
                isActive
                  ? 'bg-[var(--color-app-surface-hover)] text-[var(--color-app-text)] shadow-sm border border-[var(--color-app-border-hover)]'
                  : 'text-[var(--color-app-text-muted)] hover:bg-[var(--color-app-surface)] hover:text-[var(--color-app-text)] border border-transparent'
              }`}
            >
              <Icon size={14} className={isActive ? 'opacity-100' : 'opacity-70'} />
              <span className={`${isActive ? 'opacity-100' : 'opacity-90'}`}>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button (Desktop) */}
      <div className="hidden lg:block mt-auto p-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all outline-none text-[var(--color-app-text-muted)] hover:bg-[var(--color-app-surface-hover)] hover:text-red-400 border border-transparent"
        >
          <FaSignOutAlt size={14} className="opacity-70" />
          <span className="opacity-90">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
