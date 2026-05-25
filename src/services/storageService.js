import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadAvatar(userId, file) {
    // Validate file size strictly (2MB max) to prevent storage exhaustion
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File exceeds maximum size of 2MB.');
    }

    // Validate MIME type to prevent arbitrary execution or XSS via SVG
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Sanitize file name to prevent directory traversal or injection attacks
    const fileExt = file.name.split('.').pop().replace(/[^a-zA-Z0-9]/g, '');
    const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt.toLowerCase()) ? fileExt.toLowerCase() : 'jpg';

    // Generate secure randomized filename to prevent overwriting
    const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};
