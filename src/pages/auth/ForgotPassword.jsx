import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          {!isSubmitted ? (
            <>
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-app-text)] mb-2">Reset Password</h1>
                <p className="text-[var(--color-text-secondary)]">We'll send you a link to reset your password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-3">Check your email</h2>
              <p className="text-[var(--color-text-secondary)] mb-8">
                We've sent a password reset link to <span className="text-[var(--color-app-text)] font-medium">{email}</span>
              </p>
              <Link
                to="/login"
                className="inline-block bg-[var(--color-bg-secondary)] text-[var(--color-app-text)] border border-[var(--color-border)] font-medium py-2.5 px-6 rounded-xl hover:bg-[var(--color-surface)] transition-all"
              >
                Return to Login
              </Link>
            </motion.div>
          )}

          {!isSubmitted && (
            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-app-text)] font-medium transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to log in
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}