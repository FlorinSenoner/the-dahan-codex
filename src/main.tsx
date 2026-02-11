import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter } from './router'
import './styles/globals.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

// Initialize router async to restore cached data before first render
createRouter()
  .then((router) => {
    createRoot(rootElement).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    )
  })
  .catch((error) => {
    console.error('Failed to initialize app:', error)
    rootElement.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;text-align:center;padding:2rem">' +
      '<div><h1 style="font-size:1.25rem;margin-bottom:0.5rem">App failed to load</h1>' +
      '<p style="color:#888;margin-bottom:1rem">An unexpected error occurred during initialization.</p>' +
      '<button onclick="location.reload()" style="padding:0.5rem 1rem;border-radius:0.375rem;border:1px solid #ccc;cursor:pointer">Reload</button></div></div>'
  })
