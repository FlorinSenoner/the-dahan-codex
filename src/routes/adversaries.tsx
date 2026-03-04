import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/adversaries')({
  component: AdversariesLayout,
})

function AdversariesLayout() {
  return <Outlet />
}
