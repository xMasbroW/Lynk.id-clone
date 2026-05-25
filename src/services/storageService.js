import { supabase } from '../lib/supabase';

export const storageService = {
  /**
   * Compresses an image client-side to reduce bandwidth and storage overhead
   * before sending it to the backend or generating a signed URL.
   */
  async compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/webp', lastModified: Date.now() }));
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        }, 'image/webp', quality);
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = url;
    });
  },

  async uploadAvatar(userId, rawFile) {
    // Validate file size strictly (5MB max before compression)
    if (rawFile.size > 5 * 1024 * 1024) {
      throw new Error('File exceeds maximum size of 5MB.');
    }

    // Validate MIME type to prevent arbitrary execution or XSS via SVG
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(rawFile.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Compress file to WebP client-side to save on egress and storage
    const file = await this.compressImage(rawFile);

    // Sanitize file name
    const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
    const filePath = `avatars/${fileName}`;

    // Note: In a true zero-trust distributed setup, we would request a signedUploadUrl from an Edge Function here
    // const { signedUrl } = await apiClient.invokeFunction('create-signed-upload', { filePath });
    // For this tier, direct supabase storage upload with RLS is sufficient.

    const { error: uploadError } = await supabase.storage
      .from('media') // Centralized media bucket
      .upload(filePath, file, {
        cacheControl: '31536000', // Cache aggressively (1 year)
        upsert: false // Immutable blobs
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};
