import { FaCheckCircle, FaUser } from 'react-icons/fa';
import CreatorStats from './CreatorStats';
import MusicStatus from './MusicStatus';

const ProfileCard = ({ name, bio, avatarUrl, verified }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-2 px-2 w-full relative">
      {/* Editorial Avatar Treatment */}
      <div className="relative mb-6 group shrink-0">
        <div className="absolute -inset-4 rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.15)_25%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0)_100%)] animate-[spin-slow_8s_linear_infinite] blur-xl opacity-40 mix-blend-screen pointer-events-none"></div>

        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent p-[1px] pointer-events-none">
          <div className="absolute inset-0 bg-black rounded-full h-full w-full"></div>
        </div>

        {/* Graceful fallback for missing avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name || "User"}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[3px] border-[var(--color-app-bg)] object-cover shadow-xl bg-[var(--color-app-surface)]"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          style={{ display: avatarUrl ? 'none' : 'flex' }}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[3px] border-[var(--color-app-bg)] bg-[var(--color-app-surface)] items-center justify-center text-[var(--color-app-text-muted)] shadow-xl"
        >
          <FaUser size={40} />
        </div>
      </div>

      {/* Name & Badge - Handles long names with line-clamp */}
      <div className="flex items-center justify-center gap-2 mb-2 max-w-full px-4">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-app-text)] truncate">
          {name || "Anonymous"}
        </h1>
        {verified && (
          <FaCheckCircle className="text-[var(--color-app-text)] text-lg opacity-90 drop-shadow-sm shrink-0" />
        )}
      </div>

      {/* Bio - Handles long text safely */}
      <p className="text-[var(--color-app-text-muted)] text-center text-[14px] sm:text-[15px] max-w-[280px] sm:max-w-xs leading-relaxed font-normal tracking-wide break-words line-clamp-3">
        {bio || "No bio yet."}
      </p>

      {/* Refined Stats Section */}
      <div className="w-full mt-6 flex flex-col items-center">
        <div className="w-8 h-[1px] bg-[var(--color-app-border)] mb-6 opacity-50"></div>
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
