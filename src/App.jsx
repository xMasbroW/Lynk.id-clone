import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));

function App() {
  const location = useLocation();

  return (
    <>
      <Toaster position="bottom-center" toastOptions={{ className: 'bg-[var(--color-surface)] text-[var(--color-app-text)] border border-[var(--color-border)]' }} />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="min-h-screen bg-[var(--color-app-bg)] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--color-app-border)] border-t-[var(--color-app-text)] rounded-full animate-spin"></div></div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Public Profile Route - Catch All */}
            <Route path="/:username" element={<PublicProfile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default App;
