import { FaYoutube, FaInstagram, FaGlobe, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import ProfileCard from './components/ProfileCard';
import LinkButton from './components/LinkButton';
import SocialIcons from './components/SocialIcons';
import BottomCTA from './components/BottomCTA';

function App() {
  const profileInfo = {
    name: "Alex Doe",
    bio: "Digital creator & developer. Building tools for the future. Check out my latest content below! ✨",
    // Random high quality face avatar from Unsplash
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250&h=250"
  };

  const links = [
    {
      id: 1,
      title: "Latest YouTube Video",
      url: "https://youtube.com",
      icon: FaYoutube
    },
    {
      id: 2,
      title: "Follow on TikTok",
      url: "https://tiktok.com",
      icon: FaTiktok
    },
    {
      id: 3,
      title: "Instagram Gallery",
      url: "https://instagram.com",
      icon: FaInstagram
    },
    {
      id: 4,
      title: "Chat on WhatsApp",
      url: "https://whatsapp.com",
      icon: FaWhatsapp
    },
    {
      id: 5,
      title: "Personal Website & Portfolio",
      url: "https://example.com",
      icon: FaGlobe
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30 pb-24 relative overflow-x-hidden">
      {/* Background ambient light effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[40%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>

      {/* Main container */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 w-full relative z-0 flex flex-col">
        <ProfileCard
          name={profileInfo.name}
          bio={profileInfo.bio}
          avatarUrl={profileInfo.avatarUrl}
        />

        <div className="w-full flex flex-col gap-3 mt-4">
          {links.map((link) => (
            <LinkButton
              key={link.id}
              title={link.title}
              url={link.url}
              icon={link.icon}
            />
          ))}
        </div>

        <SocialIcons />
      </main>

      <BottomCTA />
    </div>
  );
}

export default App;
