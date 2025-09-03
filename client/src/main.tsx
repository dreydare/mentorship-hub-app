import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { MentorProvider } from './contexts/MentorContext'
import { SessionProvider } from './contexts/SessionContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <MentorProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </MentorProvider>
    </AuthProvider>
  </StrictMode>,
)
