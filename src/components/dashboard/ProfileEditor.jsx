import { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

const ProfileEditor = () => {
  const { profile, setProfile } = useAppContext();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ [name]: type === 'checkbox' ? checked : value });
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // basic validation
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(fileExt.toLowerCase())) {
         throw new Error('Only image files are allowed.');
      }
      if (file.size > 2 * 1024 * 1024) {
         throw new Error('File size must be less than 2MB.');
      }
      const publicUrl = await storageService.uploadAvatar(user.id, file);
      setProfile({ avatar_url: publicUrl });
      toast.success('Avatar updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl w-full flex flex-col gap-5">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-app-text)]">Edit Profile</h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-app-text-muted)]">Avatar</label>

        <div className="flex items-center gap-4">
          <div className="shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-[var(--color-app-border)]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--color-app-surface)] border border-[var(--color-app-border)] flex items-center justify-center text-[var(--color-app-text-muted)]">
                 <FaCloudUploadAlt size={24} />
              </div>
            )}
          </div>
          <div className="flex-1">
             <input
               type="file"
               accept="image/png, image/jpeg, image/webp"
               onChange={uploadAvatar}
               disabled={uploading}
               ref={fileInputRef}
               className="hidden"
               id="avatar-upload"
             />
             <label
               htmlFor="avatar-upload"
               className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-app-surface)] hover:bg-[var(--color-app-surface-hover)] border border-[var(--color-app-border)] rounded-xl text-sm font-medium text-[var(--color-app-text)] cursor-pointer transition-colors"
             >
               {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
               {uploading ? 'Uploading...' : 'Upload Image'}
             </label>
             <p className="text-xs text-[var(--color-app-text-muted)] mt-2">Recommended: 400x400px. Max 2MB.</p>
          </div>
        </div>

        <div className="flex items-center my-2">
            <div className="flex-grow h-px bg-[var(--color-app-border)]"></div>
            <span className="px-3 text-xs text-[var(--color-app-text-muted)] uppercase">or use URL</span>
            <div className="flex-grow h-px bg-[var(--color-app-border)]"></div>
        </div>

        <input
          type="text"
          name="avatar_url"
          value={profile.avatar_url || ''}
          onChange={handleChange}
          className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-app-text)] transition-colors"
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-app-text-muted)]">Display Name</label>
        <input
          type="text"
          name="full_name"
          value={profile.full_name || ''}
          onChange={handleChange}
          className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-app-text)] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-app-text-muted)]">Bio</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows="3"
          className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-app-text)] transition-colors resize-none"
        />
      </div>

      <div className="flex items-center gap-3 mt-2">
        <input
          type="checkbox"
          id="verified"
          name="verified"
          checked={profile.verified}
          onChange={handleChange}
          className="w-5 h-5 accent-[var(--color-app-text)] bg-[var(--color-app-surface)] border-[var(--color-app-border)] rounded cursor-pointer"
        />
        <label htmlFor="verified" className="text-sm font-medium text-[var(--color-app-text)] cursor-pointer select-none">
          Show Verified Badge
        </label>
      </div>
    </div>
  );
};

export default ProfileEditor;
