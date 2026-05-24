import { FaFolderOpen } from 'react-icons/fa';

const EmptyState = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-panel rounded-3xl min-h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-app-surface-hover)] text-[var(--color-app-text-muted)] flex items-center justify-center mb-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
        <FaFolderOpen size={24} />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-app-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-app-text-muted)] max-w-[250px] mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-[var(--color-app-text)] text-[var(--color-app-bg)] px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
