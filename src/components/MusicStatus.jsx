import { FaMusic } from 'react-icons/fa';

export default function MusicStatus() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 mt-4 rounded-full glass-panel border border-white/5 mx-auto max-w-fit animate-fade-in group hover:bg-white/5 transition-colors cursor-pointer">
      <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400">
        <FaMusic className="text-[10px]" />
        <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[pulse-ring_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
      </div>

      <div className="flex flex-col items-start">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Listening to</span>
          <div className="flex items-end gap-0.5 h-2.5 opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="w-[2px] bg-indigo-400 animate-[eq-bounce_1.2s_ease-in-out_infinite_0s] rounded-t-sm"></div>
            <div className="w-[2px] bg-indigo-400 animate-[eq-bounce_1.2s_ease-in-out_infinite_0.3s] rounded-t-sm"></div>
            <div className="w-[2px] bg-indigo-400 animate-[eq-bounce_1.2s_ease-in-out_infinite_0.15s] rounded-t-sm"></div>
          </div>
        </div>
        <span className="text-xs font-semibold text-zinc-100 truncate max-w-[150px] sm:max-w-[200px]">
          Midnight City - M83
        </span>
      </div>
    </div>
  );
}
