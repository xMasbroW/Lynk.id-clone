import { useAppContext } from '../../context/AppContext';

const ProfileEditor = () => {
  const { profile, setProfile } = useAppContext();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="glass-panel p-6 rounded-3xl w-full flex flex-col gap-5">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-app-text)]">Edit Profile</h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-app-text-muted)]">Avatar URL</label>
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
