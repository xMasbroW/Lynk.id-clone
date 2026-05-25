import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useNetworkState } from './hooks/useNetworkState';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
  const location = useLocation();
  const isOnline = useNetworkState();

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-orange-500 text-white text-xs font-medium py-1.5 text-center shadow-md">
          You are currently offline. Changes will be saved locally.
        </div>
      )}
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
              <Route path="/admin" element={<AdminDashboard />} />
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
