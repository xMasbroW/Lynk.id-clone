import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch {
      setError('Failed to create account. Email might be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

      {/* Subtle blur orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-app-text)] mb-2">Create Account</h1>
            <p className="text-[var(--color-text-secondary)]">Start building your audience</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center justify-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-app-text)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-app-text)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-app-text)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">Must be at least 8 characters.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-primary)] text-white font-medium py-3 px-4 rounded-xl hover:bg-[var(--color-primary-hover)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--color-primary)] hover:underline font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}