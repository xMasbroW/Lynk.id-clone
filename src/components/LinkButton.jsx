import { memo } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { iconMap } from '../utils/iconMap';
import { useAnalytics } from '../hooks/useAnalytics';

const LinkButton = memo(({ id, title, subtitle, url, iconKey, featured, isActive }) => {
  const { trackLinkClick } = useAnalytics();

  if (!isActive) return null;

  // Render directly from the map instead of passing through a getter to avoid fast-refresh static component lint errors
  const IconComponent = iconMap[iconKey] || iconMap['FaLink'];

  const handleClick = () => {
    trackLinkClick(id, url);
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group relative flex items-center justify-between w-full p-4 sm:p-5 rounded-[24px] overflow-hidden ${
        featured
          ? 'glass-panel glass-panel-hover border-white/10 dark:border-white/10 light:border-black/10'
          : 'glass-panel glass-panel-hover'
      }`}
    >
      {/* Dynamic Animated Background for Featured Card */}
      {featured && (
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-app-surface)] via-[var(--color-app-surface-hover)] to-[var(--color-app-surface)] opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
      )}

      {/* Subtle shine effect on hover (sweep animation) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-app-border-hover)] to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[sweep_2s_ease-in-out_infinite] pointer-events-none mix-blend-overlay"></div>

      <div className="flex items-center gap-4 sm:gap-5 relative z-10 w-full">
        {IconComponent && (
          <div className={`flex shrink-0 items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-[18px] transition-all duration-500 shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)] ${
            featured
              ? 'bg-[var(--color-app-text)] text-[var(--color-app-bg)] group-hover:scale-105 group-hover:shadow-[0_0_20px_var(--color-app-border-hover)]'
              : 'bg-[var(--color-app-surface-hover)] text-[var(--color-app-text-muted)] group-hover:text-[var(--color-app-text)]'
          }`}>
            <IconComponent size={22} className={featured ? 'drop-shadow-sm' : ''} />
          </div>
        )}

        <div className="flex flex-col flex-grow min-w-0 pr-2">
          <span className={`font-medium tracking-tight truncate transition-colors duration-300 ${
            featured
              ? 'text-[var(--color-app-text)] text-base sm:text-[17px]'
              : 'text-[var(--color-app-text)] text-[15px] sm:text-base opacity-90 group-hover:opacity-100'
          }`}>
            {title}
          </span>
          {subtitle && (
            <span className={`text-[13px] font-normal truncate mt-0.5 ${
              featured ? 'text-[var(--color-app-text-muted)]' : 'text-[var(--color-app-text-muted)]'
            }`}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] ${
        featured
          ? 'text-[var(--color-app-bg)] bg-[var(--color-app-text)] group-hover:scale-110'
          : 'text-[var(--color-app-text-muted)] bg-[var(--color-app-surface)] group-hover:text-[var(--color-app-text)] group-hover:bg-[var(--color-app-surface-hover)]'
      }`}>
        <FaArrowRight className="text-[14px] transform group-hover:translate-x-1 transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)" />
      </div>
    </a>
  );
});

LinkButton.displayName = 'LinkButton';

export default LinkButton;
