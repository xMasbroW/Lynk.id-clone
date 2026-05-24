import { FaCheckCircle } from 'react-icons/fa';
import CreatorStats from './CreatorStats';
import MusicStatus from './MusicStatus';

const ProfileCard = ({ name, bio, avatarUrl, verified }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4 px-2 w-full relative">
      {/* Avatar Container with Animated Glow */}
      <div className="relative mb-5 group">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[2px]">
          <div className="absolute inset-0 bg-zinc-950 rounded-full h-full w-full"></div>
        </div>
        <img
          src={avatarUrl}
          alt={name}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[3px] border-transparent object-cover shadow-[0_0_40px_rgba(99,102,241,0.2)]"
        />
        {/* Subtle inner shadow overlay */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] pointer-events-none"></div>
      </div>

      {/* Name & Badge */}
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-400 tracking-tight">
          {name}
        </h1>
        {verified && (
          <FaCheckCircle className="text-blue-500 text-lg drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        )}
      </div>

      {/* Bio */}
      <p className="text-zinc-400 text-center text-sm sm:text-base max-w-sm leading-relaxed font-medium">
        {bio}
      </p>

      {/* New Stats Section */}
      <CreatorStats />

      {/* New Music Status Widget */}
      <MusicStatus />
    </div>
  );
};

export default ProfileCard;
