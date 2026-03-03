import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter } from './router'
import './styles/globals.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

function renderBootstrapError(container: HTMLElement) {
  const outer = document.createElement('div')
  outer.style.display = 'flex'
  outer.style.alignItems = 'center'
  outer.style.justifyContent = 'center'
  outer.style.minHeight = '100vh'
  outer.style.fontFamily = 'system-ui'
  outer.style.textAlign = 'center'
  outer.style.padding = '2rem'

  const inner = document.createElement('div')

  const title = document.createElement('h1')
  title.textContent = 'App failed to load'
  title.style.fontSize = '1.25rem'
  title.style.marginBottom = '0.5rem'

  const description = document.createElement('p')
  description.textContent = 'An unexpected error occurred during initialization.'
  description.style.color = '#888'
  description.style.marginBottom = '1rem'

  const reloadButton = document.createElement('button')
  reloadButton.type = 'button'
  reloadButton.textContent = 'Reload'
  reloadButton.style.padding = '0.5rem 1rem'
  reloadButton.style.borderRadius = '0.375rem'
  reloadButton.style.border = '1px solid #ccc'
  reloadButton.style.cursor = 'pointer'
  reloadButton.addEventListener('click', () => {
    window.location.reload()
  })

  inner.append(title, description, reloadButton)
  outer.append(inner)
  container.replaceChildren(outer)
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
    renderBootstrapError(rootElement)
  })
