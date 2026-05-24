import { FaCheckCircle } from 'react-icons/fa';
import CreatorStats from './CreatorStats';
import MusicStatus from './MusicStatus';

const ProfileCard = ({ name, bio, avatarUrl, verified }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-2 px-2 w-full relative">
      {/* Editorial Avatar Treatment */}
      <div className="relative mb-6 group">
        {/* Cinematic ambient glow rotating behind avatar */}
        <div className="absolute -inset-4 rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.15)_25%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0)_100%)] animate-[spin-slow_8s_linear_infinite] blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-screen"></div>

        {/* Soft highlight border */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent p-[1px]">
          <div className="absolute inset-0 bg-black rounded-full h-full w-full"></div>
        </div>

        <img
          src={avatarUrl}
          alt={name}
          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border-[4px] border-black object-cover shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Name & Badge with Subtle Gradient */}
      <div className="flex items-center gap-2.5 mb-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 animate-[text-gradient_8s_ease_infinite] bg-[length:200%_auto]">
          {name}
        </h1>
        {verified && (
          <FaCheckCircle className="text-zinc-100 text-xl opacity-90 shadow-[0_0_12px_rgba(255,255,255,0.2)] drop-shadow-sm" />
        )}
      </div>

      {/* Bio */}
      <p className="text-zinc-400 text-center text-[15px] sm:text-base max-w-[280px] sm:max-w-xs leading-relaxed font-normal tracking-wide">
        {bio}
      </p>

      {/* Refined Stats Section */}
      <div className="w-full mt-6 flex flex-col items-center">
        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-6 opacity-50"></div>
        <CreatorStats />
      </div>

      {/* Refined Music Status Widget */}
      <div className="mt-8 w-full">
        <MusicStatus />
      </div>
    </div>
  );
};

export default ProfileCard;
