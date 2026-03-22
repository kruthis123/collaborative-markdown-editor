import AuthenticatedNavbar from '@/ui/components/AuthenticatedNavbar'
import DocumentList from '@/ui/components/DocumentList'
import DocumentsHeader from '@/ui/components/DocumentsHeader'
import UserLoader from '@/ui/components/UserLoader'
import { getCurrentUser } from '@/lib/session'
import { getOwnedDocuments, getSharedDocuments } from '../../actions/documents'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const [ownedResult, sharedResult] = await Promise.all([
    getOwnedDocuments(),
    getSharedDocuments()
  ])

  const ownedDocuments = ownedResult.documents || []
  const sharedDocuments = sharedResult.documents || []

  return (
    <div className="h-screen flex flex-col">
      <UserLoader userId={user.id.toString()} userName={user.name || 'User'} />
      <AuthenticatedNavbar userName={user.name} userEmail={user.email} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <DocumentsHeader />
          <DocumentList 
            ownedDocuments={ownedDocuments}
            sharedDocuments={sharedDocuments}
          />
        </div>
      </div>
    </div>
  )
}
