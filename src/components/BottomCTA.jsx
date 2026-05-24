import { FaBolt } from 'react-icons/fa';

const BottomCTA = () => {
  return (
    <div className="fixed bottom-0 z-50 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent flex justify-center pointer-events-none pb-8">
      <button className="pointer-events-auto group relative flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-white overflow-hidden transition-all duration-500 transform hover:-translate-y-1 active:scale-[0.97] shadow-[0_8px_32px_rgba(79,70,229,0.25)] hover:shadow-[0_16px_48px_rgba(79,70,229,0.4)]">

        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 group-hover:bg-[length:200%_auto] bg-[length:100%_auto] transition-all duration-700 ease-in-out group-hover:animate-[gradient-shift_3s_ease_infinite]"></div>

        {/* Subtle inner border */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] pointer-events-none"></div>

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] pointer-events-none"></div>

        <FaBolt className="text-white/80 group-hover:text-white transition-colors relative z-10 text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        <span className="relative z-10 tracking-wide text-[15px]">Create your Profile</span>
      </button>
    </div>
  );
};

export default BottomCTA;
