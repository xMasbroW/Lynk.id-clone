import { FaArrowRight } from 'react-icons/fa';

const LinkButton = ({ title, subtitle, url, icon: Icon, featured }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center justify-between w-full p-4 rounded-3xl transition-all duration-500 transform hover:-translate-y-1 active:scale-[0.98] overflow-hidden ${
        featured
          ? 'bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 border border-indigo-500/30 shadow-[0_8px_32px_rgba(99,102,241,0.15)] hover:shadow-[0_16px_48px_rgba(99,102,241,0.25)] hover:border-indigo-400/50'
          : 'glass-panel glass-panel-hover'
      }`}
    >
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite] pointer-events-none"></div>

      <div className="flex items-center gap-4 relative z-10">
        {Icon && (
          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
            featured
              ? 'bg-indigo-500/20 text-indigo-300 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]'
              : 'bg-zinc-800/50 text-zinc-400 group-hover:text-zinc-100 group-hover:bg-zinc-700/50 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]'
          }`}>
            <Icon size={20} className={featured ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
          </div>
        )}
        <div className="flex flex-col">
          <span className={`font-semibold transition-colors duration-300 ${
            featured ? 'text-zinc-50 text-base sm:text-lg' : 'text-zinc-200 text-sm sm:text-base group-hover:text-white'
          }`}>
            {title}
          </span>
          {subtitle && (
            <span className={`text-xs font-medium mt-0.5 ${
              featured ? 'text-indigo-200/80' : 'text-zinc-500 group-hover:text-zinc-400'
            }`}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
        featured
          ? 'text-indigo-300 bg-indigo-500/10 group-hover:bg-indigo-500/30'
          : 'text-zinc-500 group-hover:text-zinc-200 group-hover:bg-white/5'
      }`}>
        <FaArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </a>
  );
};

export default LinkButton;
