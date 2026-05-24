import { useAppContext } from '../../context/AppContext';
import { FaEdit, FaEye } from 'react-icons/fa';

const MobilePreviewToggle = () => {
  const { isEditMode, setIsEditMode } = useAppContext();

  return (
    <div className="fixed top-4 right-4 z-50 lg:hidden">
      <button
        onClick={() => setIsEditMode(!isEditMode)}
        className="glass-panel flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[var(--color-app-text)] shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        {!isEditMode ? (
          <><FaEdit size={14} /> Edit</>
        ) : (
          <><FaEye size={14} /> Preview</>
        )}
      </button>
    </div>
  );
};

export default MobilePreviewToggle;
