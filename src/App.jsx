import { FaYoutube, FaInstagram, FaGlobe, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import ProfileCard from './components/ProfileCard';
import LinkButton from './components/LinkButton';
import SocialIcons from './components/SocialIcons';
import BottomCTA from './components/BottomCTA';

function App() {
  const profileInfo = {
    name: "Alex Doe",
    bio: "Digital creator & developer. Building tools for the future.",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250&h=250",
    verified: true
  };

  const links = [
    {
      id: 1,
      title: "Latest Masterclass: Web3",
      subtitle: "Just dropped - Learn the fundamentals",
      url: "https://youtube.com",
      icon: FaYoutube,
      featured: true
    },
    {
      id: 2,
      title: "Daily Vlogs",
      url: "https://tiktok.com",
      icon: FaTiktok
    },
    {
      id: 3,
      title: "Behind the Scenes",
      url: "https://instagram.com",
      icon: FaInstagram
    },
    {
      id: 4,
      title: "Community Chat",
      url: "https://whatsapp.com",
      icon: FaWhatsapp
    },
    {
      id: 5,
      title: "Portfolio & Services",
      url: "https://example.com",
      icon: FaGlobe
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-white/20 pb-36 relative overflow-x-hidden font-sans">
      {/* High-End Dynamic Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft atmospheric lighting meshes */}
        <div className="absolute top-[-15%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(63,63,70,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[80px] opacity-70"></div>
        <div className="absolute top-[20%] right-[-30%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(39,39,42,0.1)_0%,rgba(0,0,0,0)_60%)] blur-[100px] animate-[float_15s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[90vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(24,24,27,0.4)_0%,rgba(0,0,0,0)_70%)] blur-[120px]"></div>

        {/* Subtle cinematic tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80 mix-blend-overlay"></div>

        {/* Fine noise texture overlay for realism */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      {/* Main container - Asymmetric, airy layout */}
      <main className="max-w-2xl mx-auto px-5 sm:px-8 w-full relative z-10 flex flex-col pt-16 sm:pt-20">
        <div className="cinematic-enter">
          <ProfileCard
            name={profileInfo.name}
            bio={profileInfo.bio}
            avatarUrl={profileInfo.avatarUrl}
            verified={profileInfo.verified}
          />
        </div>

        <div className="w-full flex flex-col gap-3.5 mt-10 cinematic-enter delay-200">
          {links.map((link, index) => (
            <div key={link.id} className={`cinematic-enter delay-${Math.min((index + 3) * 100, 500)}`}>
              <LinkButton
                title={link.title}
                subtitle={link.subtitle}
                url={link.url}
                icon={link.icon}
                featured={link.featured}
              />
            </div>
          ))}
        </div>

        <div className="mt-14 cinematic-enter delay-500 flex justify-center pb-8">
          <SocialIcons />
        </div>
      </main>

      {/* Floating dock CTA area */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none cinematic-enter delay-500">
        <BottomCTA />
      </div>
    </div>
  );
}

export default App;
