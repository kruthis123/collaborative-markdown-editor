import AuthenticatedNavbar from '@/ui/components/AuthenticatedNavbar'
import { getCurrentUser } from '@/app/lib/session'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="h-screen flex flex-col">
      <AuthenticatedNavbar userName={user.name} userEmail={user.email} />
      <div className="flex flex-1 overflow-hidden">
        {/* Add your markdown editor content here */}
      </div>
    </div>
  )
}
