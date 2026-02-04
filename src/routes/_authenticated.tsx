import { useAuth } from '@clerk/clerk-react'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/sign-in/$', params: { _splat: '' } })
    }
  }, [isLoaded, isSignedIn, navigate])

  if (!isLoaded) {
    return <div style={{ padding: '2rem' }}>Loading...</div>
  }

  if (!isSignedIn) {
    return <div style={{ padding: '2rem' }}>Redirecting to sign in...</div>
  }

  return <Outlet />
}
