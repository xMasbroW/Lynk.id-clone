import { FaMousePointer, FaEye, FaArrowUp, FaGlobe, FaMobileAlt, FaDesktop } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', views: 400, clicks: 240 },
  { name: 'Tue', views: 300, clicks: 139 },
  { name: 'Wed', views: 200, clicks: 980 },
  { name: 'Thu', views: 278, clicks: 390 },
  { name: 'Fri', views: 189, clicks: 480 },
  { name: 'Sat', views: 239, clicks: 380 },
  { name: 'Sun', views: 349, clicks: 430 },
];

const AnalyticsTab = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-32 lg:pb-8">

      <div className="flex items-center justify-between sticky top-0 z-20 bg-[var(--color-app-bg)]/80 backdrop-blur-md py-4 border-b border-transparent">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-app-text)]">Analytics Overview</h2>
        <select className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] text-[var(--color-app-text)] text-sm rounded-lg px-3 py-1.5 focus:outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>All Time</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[var(--color-app-text-muted)]">
            <FaEye size={14} />
            <span className="text-sm font-medium">Profile Views</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[var(--color-app-text)] tracking-tight">12.4K</span>
            <span className="flex items-center text-xs font-medium text-emerald-500 mb-1">
              <FaArrowUp size={10} className="mr-0.5" /> 14%
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[var(--color-app-text-muted)]">
            <FaMousePointer size={12} />
            <span className="text-sm font-medium">Total Clicks</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[var(--color-app-text)] tracking-tight">8,241</span>
            <span className="flex items-center text-xs font-medium text-emerald-500 mb-1">
              <FaArrowUp size={10} className="mr-0.5" /> 8%
            </span>
          </div>
        </div>
      </div>

      {/* Real Chart Area */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-[var(--color-app-text)]">Traffic Trend</span>
          <span className="text-xs font-medium text-[var(--color-app-text-muted)]">Click-through Rate: 66.4%</span>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--color-app-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-app-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-app-surface)', borderColor: 'var(--color-app-border)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--color-app-text)' }}
              />
              <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="clicks" stroke="#82ca9d" fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Split Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Devices */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-4">
          <span className="text-sm font-semibold text-[var(--color-app-text)]">Devices</span>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[var(--color-app-text-muted)]">
                <FaMobileAlt size={14} /> Mobile
              </div>
              <span className="text-sm font-semibold text-[var(--color-app-text)]">82%</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--color-app-surface)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-app-text)] w-[82%]"></div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-sm text-[var(--color-app-text-muted)]">
                <FaDesktop size={14} /> Desktop
              </div>
              <span className="text-sm font-semibold text-[var(--color-app-text)]">18%</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--color-app-surface)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-app-surface-hover)] w-[18%]"></div>
            </div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-4">
          <span className="text-sm font-semibold text-[var(--color-app-text)]">Top Locations</span>
          <div className="flex flex-col gap-3">
            {[
              { country: 'United States', pct: '45%' },
              { country: 'United Kingdom', pct: '12%' },
              { country: 'Canada', pct: '8%' }
            ].map((loc, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-[var(--color-app-border)] last:border-0">
                <div className="flex items-center gap-2 text-sm text-[var(--color-app-text-muted)]">
                  <FaGlobe size={12} className="opacity-50" /> {loc.country}
                </div>
                <span className="text-sm font-medium text-[var(--color-app-text)]">{loc.pct}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsTab;
