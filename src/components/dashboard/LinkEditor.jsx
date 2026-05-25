import { useAppContext } from '../../context/AppContext';
import { useEntitlements } from '../../hooks/useEntitlements';
import { FaPlus, FaTrash, FaGripVertical, FaEye, FaEyeSlash, FaCrown } from 'react-icons/fa';
import EmptyState from '../EmptyState';
import toast from 'react-hot-toast';

const LinkEditor = () => {
  const { links, addLink, updateLink, deleteLink, moveLink } = useAppContext();
  const { maxLinks } = useEntitlements();

  const handleAddLink = () => {
    if (links.length >= maxLinks) {
      toast.error(`Plan limit reached. Upgrade to add more than ${maxLinks} links.`);
      return;
    }
    addLink();
  };

  if (links.length === 0) {
    return (
      <EmptyState
        title="No links yet"
        description="Add your first link to start building your creator profile."
        actionLabel="Add Link"
        onAction={addLink}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-32 lg:pb-8">
      <div className="flex items-center justify-between sticky top-0 z-20 bg-[var(--color-app-bg)]/80 backdrop-blur-md py-4 border-b border-transparent">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-app-text)]">Manage Links</h2>
        <button
          onClick={handleAddLink}
          className="flex items-center gap-2 bg-[var(--color-app-text)] text-[var(--color-app-bg)] px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus size={12} />
          Add Link
        </button>
      </div>

      {links.length >= maxLinks && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-center gap-3">
          <FaCrown className="text-orange-500 shrink-0" />
          <p className="text-sm text-orange-500 font-medium">You've reached your free plan limit of {maxLinks} links. Upgrade to Pro to add more.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {links.map((link, index) => (
          <div key={link.id} className={`glass-panel p-4 rounded-2xl flex items-center gap-3 relative group transition-opacity ${!link.is_active ? 'opacity-60' : 'opacity-100'}`}>

            {/* Reorder Handle (Simplified for tactical feel) */}
            <div className="flex flex-col items-center justify-center gap-1 text-[var(--color-app-text-muted)] w-8 cursor-grab active:cursor-grabbing hover:text-[var(--color-app-text)] transition-colors">
              <FaGripVertical size={14} className="opacity-50" />
              <div className="flex gap-1 mt-1">
                <button onClick={() => moveLink(index, -1)} disabled={index === 0} className="p-1 hover:bg-[var(--color-app-surface-hover)] rounded disabled:opacity-30">↑</button>
                <button onClick={() => moveLink(index, 1)} disabled={index === links.length - 1} className="p-1 hover:bg-[var(--color-app-surface-hover)] rounded disabled:opacity-30">↓</button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-grow flex flex-col gap-2 min-w-0 pr-8 sm:pr-12">
              <input
                type="text"
                value={link.title}
                onChange={(e) => updateLink(link.id, { title: e.target.value })}
                placeholder="Link Title"
                className="w-full bg-transparent border-b border-transparent hover:border-[var(--color-app-border)] focus:border-[var(--color-app-text)] px-1 py-1 text-[15px] font-medium text-[var(--color-app-text)] focus:outline-none transition-colors truncate"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-transparent border-b border-transparent hover:border-[var(--color-app-border)] focus:border-[var(--color-app-text)] px-1 py-1 text-[13px] text-[var(--color-app-text-muted)] focus:outline-none transition-colors truncate"
              />
              <div className="flex flex-wrap items-center gap-3 mt-1 px-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] transition-colors uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={link.featured}
                    onChange={(e) => updateLink(link.id, { featured: e.target.checked })}
                    className="accent-[var(--color-app-text)] w-3 h-3"
                  />
                  Featured
                </label>
                <input
                  type="text"
                  value={link.icon_key || ''}
                  onChange={(e) => updateLink(link.id, { icon_key: e.target.value })}
                  placeholder="Icon (e.g. FaYoutube)"
                  className="w-24 bg-[var(--color-app-surface-hover)] border border-transparent rounded px-2 py-0.5 text-[11px] text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-app-text-muted)] transition-colors"
                />
              </div>
            </div>

            {/* Actions (Absolute top right on mobile, static on desktop) */}
            <div className="absolute top-3 right-3 sm:static sm:h-full flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => updateLink(link.id, { is_active: !link.is_active })}
                className="p-2 text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] transition-colors"
                title={link.is_active ? "Hide Link" : "Show Link"}
              >
                {link.is_active ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
              </button>
              <button
                onClick={() => deleteLink(link.id)}
                className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete Link"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkEditor;
