import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaTimes } from 'react-icons/fa';

export const OnboardingWizard = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    theme_preference: 'dark'
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete({ bio: formData.bio }); // Send updates to hook
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--color-app-bg)]/95 backdrop-blur-xl flex items-center justify-center p-4">
      <button onClick={onSkip} className="absolute top-6 right-6 p-2 text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] transition-colors">
        <FaTimes size={20} />
      </button>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="glass-panel p-8 rounded-[32px] w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[var(--color-app-text)]' : 'bg-[var(--color-app-surface)]'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[var(--color-app-text)]' : 'bg-[var(--color-app-surface)]'}`} />
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-app-text)] mb-2">Welcome to Lynk</h2>
              <p className="text-[var(--color-app-text-muted)]">Let's set up your creator profile in 60 seconds.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-app-text-muted)]">What do you do?</label>
              <textarea
                placeholder="e.g. Digital creator & developer sharing tips on building SaaS..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded-xl px-4 py-3 text-[var(--color-app-text)] outline-none resize-none h-24"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-app-text)] mb-2">Pick a vibe</h2>
              <p className="text-[var(--color-app-text-muted)]">You can always customize this later.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormData({ ...formData, theme_preference: 'dark' })}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.theme_preference === 'dark' ? 'border-[var(--color-app-text)] bg-[var(--color-app-surface)]' : 'border-[var(--color-app-border)] hover:border-[var(--color-app-text-muted)]'}`}
              >
                <div className="w-12 h-12 rounded-full bg-black border border-white/20"></div>
                <span className="text-sm font-medium text-[var(--color-app-text)]">Dark Mode</span>
              </button>
              <button
                onClick={() => setFormData({ ...formData, theme_preference: 'light' })}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.theme_preference === 'light' ? 'border-[var(--color-app-text)] bg-[var(--color-app-surface)]' : 'border-[var(--color-app-border)] hover:border-[var(--color-app-text-muted)]'}`}
              >
                <div className="w-12 h-12 rounded-full bg-white border border-black/10 shadow-sm"></div>
                <span className="text-sm font-medium text-[var(--color-app-text)]">Light Mode</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          className="mt-8 w-full py-3.5 bg-[var(--color-app-text)] text-[var(--color-app-bg)] rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {step === 2 ? 'Complete Setup' : 'Continue'} <FaArrowRight size={12} />
        </button>
      </motion.div>
    </div>
  );
};
