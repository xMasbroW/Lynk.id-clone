import { FaArrowRight } from 'react-icons/fa';

const LinkButton = ({ title, subtitle, url, icon: Icon, featured }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center justify-between w-full p-4 sm:p-5 rounded-[24px] overflow-hidden ${
        featured
          ? 'glass-panel glass-panel-hover border-white/10'
          : 'glass-panel glass-panel-hover'
      }`}
    >
      {/* Dynamic Animated Background for Featured Card */}
      {featured && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/40 via-zinc-700/20 to-zinc-800/40 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
      )}

      {/* Subtle shine effect on hover (sweep animation) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[sweep_2s_ease-in-out_infinite] pointer-events-none mix-blend-overlay"></div>

      <div className="flex items-center gap-4 sm:gap-5 relative z-10 w-full">
        {Icon && (
          <div className={`flex shrink-0 items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-[18px] transition-all duration-500 shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)] ${
            featured
              ? 'bg-zinc-100 text-black group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              : 'bg-zinc-800/60 text-zinc-300 group-hover:bg-zinc-700/80 group-hover:text-white'
          }`}>
            <Icon size={22} className={featured ? 'drop-shadow-sm' : ''} />
          </div>
        )}

        <div className="flex flex-col flex-grow min-w-0 pr-2">
          <span className={`font-medium tracking-tight truncate transition-colors duration-300 ${
            featured ? 'text-zinc-50 text-base sm:text-[17px]' : 'text-zinc-200 text-[15px] sm:text-base group-hover:text-white'
          }`}>
            {title}
          </span>
          {subtitle && (
            <span className={`text-[13px] font-normal truncate mt-0.5 ${
              featured ? 'text-zinc-400' : 'text-zinc-500 group-hover:text-zinc-400'
            }`}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] ${
        featured
          ? 'text-black bg-white group-hover:scale-110'
          : 'text-zinc-500 bg-zinc-800/40 group-hover:text-zinc-200 group-hover:bg-zinc-700/60'
      }`}>
        <FaArrowRight className="text-[14px] transform group-hover:translate-x-1 transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)" />
      </div>
    </a>
  );
};

export default LinkButton;
