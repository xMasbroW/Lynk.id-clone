import { FaMusic } from 'react-icons/fa';

export default function MusicStatus() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full glass-panel glass-panel-hover border border-white/5 mx-auto max-w-fit cursor-pointer">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800/50 text-zinc-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
          <FaMusic className="text-[10px] relative z-10" />
          <div className="absolute inset-0 rounded-full border border-white/10 animate-[pulse-ring_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        </div>

        <div className="flex flex-col items-start pr-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">Listening</span>
            <div className="flex items-end gap-[1px] h-2.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="w-[1.5px] bg-zinc-400 animate-[eq-bounce_1.2s_ease-in-out_infinite_0s] rounded-t-sm"></div>
              <div className="w-[1.5px] bg-zinc-400 animate-[eq-bounce_1.2s_ease-in-out_infinite_0.3s] rounded-t-sm"></div>
              <div className="w-[1.5px] bg-zinc-400 animate-[eq-bounce_1.2s_ease-in-out_infinite_0.15s] rounded-t-sm"></div>
            </div>
          </div>
          <span className="text-[13px] font-medium text-zinc-200 truncate max-w-[140px] sm:max-w-[200px] mt-0.5">
            Midnight City - M83
          </span>
        </div>
      </div>
    </div>
  );
}
