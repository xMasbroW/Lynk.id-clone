import { FaEye, FaUsers, FaHeart } from 'react-icons/fa';

export default function CreatorStats() {
  const stats = [
    { label: 'Followers', value: '124K', icon: FaUsers, color: 'text-blue-400' },
    { label: 'Monthly Views', value: '1.2M', icon: FaEye, color: 'text-indigo-400' },
    { label: 'Likes', value: '8.4M', icon: FaHeart, color: 'text-fuchsia-400' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 mt-5 w-full">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="flex flex-col items-center gap-1 group">
            <div className="flex items-center gap-1.5">
              <Icon className={`text-xs ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <span className="text-sm font-bold text-zinc-100 tracking-tight">{stat.value}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
