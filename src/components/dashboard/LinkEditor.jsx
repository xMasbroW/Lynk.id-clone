import { useAppContext } from '../../context/AppContext';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const LinkEditor = () => {
  const { links, addLink, updateLink, deleteLink, moveLink } = useAppContext();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-app-text)]">Manage Links</h2>
        <button
          onClick={addLink}
          className="flex items-center gap-2 bg-[var(--color-app-text)] text-[var(--color-app-bg)] px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all"
        >
          <FaPlus size={12} />
          Add Link
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {links.map((link, index) => (
          <div key={link.id} className="glass-panel p-5 rounded-3xl flex flex-col sm:flex-row gap-4 relative group">

            {/* Reorder controls (Left side, prep for future drag and drop handle) */}
            <div className="flex sm:flex-col items-center justify-center gap-2 text-[var(--color-app-text-muted)] w-full sm:w-auto">
              <button
                onClick={() => moveLink(index, -1)}
                disabled={index === 0}
                className="p-1.5 hover:text-[var(--color-app-text)] disabled:opacity-30 disabled:hover:text-[var(--color-app-text-muted)] transition-colors"
              >
                <FaArrowUp size={14} />
              </button>
              <button
                onClick={() => moveLink(index, 1)}
                disabled={index === links.length - 1}
                className="p-1.5 hover:text-[var(--color-app-text)] disabled:opacity-30 disabled:hover:text-[var(--color-app-text-muted)] transition-colors"
              >
                <FaArrowDown size={14} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-grow flex flex-col gap-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => updateLink(link.id, { title: e.target.value })}
                  placeholder="Link Title"
                  className="flex-grow bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-app-text)]"
                />
                <input
                  type="text"
                  value={link.iconKey}
                  onChange={(e) => updateLink(link.id, { iconKey: e.target.value })}
                  placeholder="Icon Key (e.g. FaYoutube)"
                  className="w-1/3 bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-app-text)]"
                />
              </div>
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-app-text)]"
              />
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] transition-colors">
                  <input
                    type="checkbox"
                    checked={link.isActive}
                    onChange={(e) => updateLink(link.id, { isActive: e.target.checked })}
                    className="accent-[var(--color-app-text)]"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] transition-colors">
                  <input
                    type="checkbox"
                    checked={link.featured}
                    onChange={(e) => updateLink(link.id, { featured: e.target.checked })}
                    className="accent-[var(--color-app-text)]"
                  />
                  Featured
                </label>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={() => deleteLink(link.id)}
              className="absolute top-4 right-4 sm:static sm:h-auto sm:self-start p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <FaTrash size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkEditor;
