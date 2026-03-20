import AuthenticatedNavbar from '@/ui/components/AuthenticatedNavbar'
import MainContainer from '@/ui/components/MainContainer'
import { getCurrentUser } from '@/app/lib/session'
import { redirect } from 'next/navigation'

export default async function EditorPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <AuthenticatedNavbar userName={user.name} userEmail={user.email} />
      <MainContainer />
    </div>
  )
}
