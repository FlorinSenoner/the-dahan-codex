import { SignUp } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up/$')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignUp />
    </div>
  )
}
