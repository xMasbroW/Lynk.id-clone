import { createContext, useContext, useState, useEffect } from 'react';

// Default configuration-driven data structure
const initialProfileInfo = {
  name: "Alex Doe",
  bio: "Digital creator & developer. Building tools for the future.",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250&h=250",
  verified: true
};

const initialLinks = [
  {
    id: '1',
    title: "Latest Masterclass: Web3",
    subtitle: "Just dropped - Learn the fundamentals",
    url: "https://youtube.com",
    iconKey: "FaYoutube",
    featured: true,
    isActive: true
  },
  {
    id: '2',
    title: "Daily Vlogs",
    subtitle: "",
    url: "https://tiktok.com",
    iconKey: "FaTiktok",
    featured: false,
    isActive: true
  },
  {
    id: '3',
    title: "Behind the Scenes",
    subtitle: "",
    url: "https://instagram.com",
    iconKey: "FaInstagram",
    featured: false,
    isActive: true
  },
  {
    id: '4',
    title: "Community Chat",
    subtitle: "",
    url: "https://whatsapp.com",
    iconKey: "FaWhatsapp",
    featured: false,
    isActive: true
  },
  {
    id: '5',
    title: "Portfolio & Services",
    subtitle: "",
    url: "https://example.com",
    iconKey: "FaGlobe",
    featured: false,
    isActive: true
  }
];

const initialTheme = {
  mode: 'dark', // 'dark' | 'light'
  accent: 'indigo',
};

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('saas_profile');
    return saved ? JSON.parse(saved) : initialProfileInfo;
  });

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('saas_links');
    return saved ? JSON.parse(saved) : initialLinks;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('saas_theme');
    return saved ? JSON.parse(saved) : initialTheme;
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('saas_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('saas_links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('saas_theme', JSON.stringify(theme));
  }, [theme]);

  // Link Management Handlers
  const addLink = () => {
    const newLink = {
      id: Date.now().toString(),
      title: "New Link",
      subtitle: "",
      url: "https://",
      iconKey: "FaGlobe",
      featured: false,
      isActive: true
    };
    setLinks([newLink, ...links]);
  };

  const updateLink = (id, updates) => {
    setLinks(links.map(link => link.id === id ? { ...link, ...updates } : link));
  };

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  // Preparation for Drag and Drop / reordering
  const moveLink = (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === links.length - 1)
    ) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[index + direction];
    newLinks[index + direction] = temp;
    setLinks(newLinks);
  };

  return (
    <AppContext.Provider value={{
      profile, setProfile,
      links, setLinks,
      addLink, updateLink, deleteLink, moveLink,
      theme, setTheme,
      isEditMode, setIsEditMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
