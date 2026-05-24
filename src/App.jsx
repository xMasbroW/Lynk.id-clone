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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 pb-28 relative overflow-x-hidden font-sans">
      {/* Premium Ambient Background Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute top-[30%] right-[-15%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/10 blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] rounded-full bg-blue-600/10 blur-[130px] mix-blend-screen"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* Main container */}
      <main className="max-w-xl mx-auto px-5 sm:px-6 w-full relative z-10 flex flex-col pt-12">
        <div className="animate-slide-up">
          <ProfileCard
            name={profileInfo.name}
            bio={profileInfo.bio}
            avatarUrl={profileInfo.avatarUrl}
            verified={profileInfo.verified}
          />
        </div>

        <div className="w-full flex flex-col gap-4 mt-8 animate-slide-up-delay-1">
          {links.map((link) => (
            <LinkButton
              key={link.id}
              title={link.title}
              subtitle={link.subtitle}
              url={link.url}
              icon={link.icon}
              featured={link.featured}
            />
          ))}
        </div>

        <div className="mt-10 animate-slide-up-delay-2">
          <SocialIcons />
        </div>
      </main>

      <div className="animate-slide-up-delay-3">
        <BottomCTA />
      </div>
    </div>
  );
}

export default App;
