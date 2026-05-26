import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { validateEnv } from './lib/env.js'
import './registerSW'

import { initMonitoring } from './lib/monitoring.js'

// Validate environment before booting
validateEnv()

// Initialize Sentry and global observability
initMonitoring()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <App />
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
