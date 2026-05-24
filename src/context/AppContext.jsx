import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { profileService } from '../services/profileService';
import { linkService } from '../services/linkService';
import { themeService } from '../services/themeService';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';

// Initial state fallbacks
const initialProfileInfo = {
  full_name: "Alex Doe",
  bio: "Digital creator & developer.",
  avatar_url: "",
  verified: false
};

const initialTheme = {
  mode: 'dark', // 'dark' | 'light'
};

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfileState] = useState(initialProfileInfo);
  const [links, setLinksState] = useState([]);
  const [theme, setThemeState] = useState(initialTheme);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isLoading, setIsLoading] = useState(!!user); // only true initially if user exists

  // Load user data on mount / user change
  useEffect(() => {
    if (!user) {
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [profileData, linksData, themeData] = await Promise.all([
          profileService.getProfile(user.id).catch(() => null),
          linkService.getLinks(user.id).catch(() => []),
          themeService.getTheme(user.id).catch(() => null)
        ]);

        if (profileData) setProfileState(profileData);
        if (linksData) setLinksState(linksData);
        if (themeData) setThemeState(themeData);
      } catch (error) {
        console.error("Failed to load user data:", error);
        toast.error("Failed to load your profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Debounced server syncs
  // We cannot use useCallback directly around a created debounce without it complaining about "not an inline function".
  // The correct way in React is to put the debounce inside a useMemo.
  const syncProfile = React.useMemo(
    () => debounce(async (userId, updates, previous) => {
      try {
        await profileService.updateProfile(userId, updates);
      } catch (error) {
        setProfileState(previous);
        toast.error("Failed to update profile");
        console.error(error);
      }
    }, 1000),
    []
  );

  const syncTheme = React.useMemo(
    () => debounce(async (userId, updates, previous) => {
      try {
        await themeService.updateTheme(userId, updates);
      } catch (error) {
        setThemeState(previous);
        toast.error("Failed to update theme");
        console.error(error);
      }
    }, 1000),
    []
  );

  // Debounce per linkId to avoid race conditions and discarded updates
  const syncLinkRef = React.useRef({});
  const syncLink = React.useCallback((userId, linkId, updates, previousLinks) => {
    if (!syncLinkRef.current[linkId]) {
      syncLinkRef.current[linkId] = debounce(async (uId, lId, upds, prevLinks) => {
        try {
          await linkService.updateLink(lId, uId, upds);
        } catch (error) {
          setLinksState(prevLinks);
          toast.error("Failed to update link");
          console.error(error);
        }
      }, 1000);
    }
    syncLinkRef.current[linkId](userId, linkId, updates, previousLinks);
  }, []);

  // Profile Management with Optimistic Updates
  const setProfile = (updates) => {
    if (!user) return;
    const previous = { ...profile };
    const newProfile = { ...profile, ...updates };
    setProfileState(newProfile);
    syncProfile(user.id, updates, previous);
  };

  // Theme Management with Optimistic Updates
  const setTheme = (updates) => {
    if (!user) return;
    const previous = { ...theme };
    const newTheme = { ...theme, ...updates };
    setThemeState(newTheme);
    syncTheme(user.id, updates, previous);
  };

  // Link Management Handlers
  const addLink = async () => {
    if (!user) return;
    const optimisticId = `temp-${Date.now()}`;
    const newLink = {
      id: optimisticId,
      title: "New Link",
      subtitle: "",
      url: "https://",
      icon_key: "FaGlobe",
      featured: false,
      is_active: true,
      order_index: links.length
    };

    // Optimistic insert
    setLinksState([...links, newLink]);

    try {
      // Remove id before sending to DB as it will generate one
      const linkData = { ...newLink };
      delete linkData.id;
      const createdLink = await linkService.addLink(user.id, linkData);
      setLinksState(prev => prev.map(l => l.id === optimisticId ? createdLink : l));
      toast.success("Link added");
    } catch (error) {
      setLinksState(prev => prev.filter(l => l.id !== optimisticId));
      toast.error("Failed to add link");
      console.error(error);
    }
  };

  const updateLink = (id, updates) => {
    if (!user) return;
    const previousLinks = [...links];
    setLinksState(prev => prev.map(link => link.id === id ? { ...link, ...updates } : link));

    // If it's a temp ID, we skip server update as it's still processing creation
    if (String(id).startsWith('temp-')) return;

    syncLink(user.id, id, updates, previousLinks);
  };

  const deleteLink = async (id) => {
    if (!user) return;
    const previousLinks = [...links];
    setLinksState(prev => prev.filter(link => link.id !== id));

    if (String(id).startsWith('temp-')) return;

    try {
      await linkService.deleteLink(id, user.id);
      toast.success("Link deleted");
    } catch (error) {
      setLinksState(previousLinks);
      toast.error("Failed to delete link");
      console.error(error);
    }
  };

  // Preparation for Drag and Drop / reordering
  const moveLink = async (index, direction) => {
    if (!user) return;
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === links.length - 1)
    ) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[index + direction];
    newLinks[index + direction] = temp;

    // Optimistic reorder
    setLinksState(newLinks);

    try {
      const linkIds = newLinks.map(l => l.id);
      // Ensure we don't send temp IDs
      if(linkIds.some(id => String(id).startsWith('temp-'))) {
        return; // Avoid syncing reorder while a link is being created
      }
      await linkService.reorderLinks(user.id, linkIds);
    } catch (error) {
      setLinksState(links); // Revert
      toast.error("Failed to save order");
      console.error(error);
    }
  };

  return (
    <AppContext.Provider value={{
      profile, setProfile,
      links, setLinks: setLinksState,
      addLink, updateLink, deleteLink, moveLink,
      theme, setTheme,
      isEditMode, setIsEditMode,
      isLoading
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
