import { Zap } from 'lucide-react';

const BottomCTA = () => {
  return (
    <div className="fixed bottom-0 z-50 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent flex justify-center pointer-events-none">
      <button className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-medium text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300 active:scale-95">
        <Zap size={18} className="fill-white/20" />
        <span>Create your own Lynk</span>
      </button>
    </div>
  );
};

export default BottomCTA;
