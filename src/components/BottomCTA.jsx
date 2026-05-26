import { FaBolt } from 'react-icons/fa';

const BottomCTA = () => {
  return (
    <div className="dock-glass rounded-[32px] p-2 flex items-center justify-between pointer-events-auto transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
      <button className="group relative flex items-center gap-3 px-6 py-3.5 rounded-[24px] bg-white text-black font-semibold overflow-hidden transition-all duration-500 active:scale-[0.97]">

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-black/5 to-transparent transform -translate-x-full group-hover:animate-[sweep_1.5s_ease-in-out_infinite] pointer-events-none"></div>

        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10">
          <FaBolt className="text-black/80 text-[12px]" />
        </div>
        <span className="relative z-10 tracking-tight text-[15px]">Create your Profile</span>
      </button>
    </div>
  );
};

export default BottomCTA;
