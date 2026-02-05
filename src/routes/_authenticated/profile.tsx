import { UserButton } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/typography'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader backHref="/" title="Profile" />
      <main className="p-4 max-w-lg mx-auto">
        <Text className="mt-4">This is a protected page. You are signed in.</Text>
        <div className="mt-4">
          <UserButton />
        </div>
      </main>
    </div>
  )
}
