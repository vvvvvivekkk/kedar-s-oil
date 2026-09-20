import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Google Fonts, self-hosted (latin subsets only) so nothing render-blocking leaves the origin.
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource/karla/400.css'
import '@fontsource/karla/600.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
