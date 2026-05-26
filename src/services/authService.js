import { supabase } from '../lib/supabase';

// Helper for error handling
const handleResponse = (data, error) => {
  if (error) throw error;
  return data;
};

import { profileService } from './profileService';

export const authService = {
  async register(email, password, fullName, username) {
    // Thoroughly normalize inputs to prevent any undefined issues
    const normEmail = typeof email === 'string' ? email.trim() : '';
    const normPassword = typeof password === 'string' ? password : '';
    const normFullName = typeof fullName === 'string' ? fullName.trim() : '';
    const normUsername = typeof username === 'string' ? username.trim().toLowerCase() : '';

    if (!normEmail || !normPassword || !normUsername) {
       throw new Error('Email, password, and username are required.');
    }

    // Hardened check before sign up
    const isAvailable = await profileService.isUsernameAvailable(normUsername);
    if (!isAvailable) {
      throw new Error('Username is already taken or invalid.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: normEmail,
      password: normPassword,
      options: {
        data: {
            full_name: normFullName,
            username: normUsername
        }
      }
    });
    return handleResponse(data, error);
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return handleResponse(data, error);
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return handleResponse(data.session, error);
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
