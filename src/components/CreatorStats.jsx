import { FaEye, FaUsers, FaHeart } from 'react-icons/fa';

export default function CreatorStats() {
  const stats = [
    { label: 'Followers', value: '124K', icon: FaUsers },
    { label: 'Views', value: '1.2M', icon: FaEye },
    { label: 'Likes', value: '8.4M', icon: FaHeart },
  ];

  return (
    <div className="flex items-center justify-center gap-8 sm:gap-12 w-full">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="flex flex-col items-center gap-1.5 group cursor-default">
            <div className="flex items-center gap-2">
              <Icon className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300" />
              <span className="text-base font-semibold text-zinc-100 tracking-tight group-hover:text-white transition-colors duration-300">{stat.value}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.15em]">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
