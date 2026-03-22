import AuthenticatedNavbar from '@/ui/components/AuthenticatedNavbar'
import MainContainer from '@/ui/components/MainContainer'
import DocumentLoader from '@/ui/components/DocumentLoader'
import { getCurrentUser } from '@/lib/session'
import { getDocumentContent } from '../../../actions/documents'
import { redirect } from 'next/navigation'

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditorPage({ params }: Readonly<EditorPageProps>) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const documentId = Number.parseInt(id)
  
  if (Number.isNaN(documentId)) {
    redirect('/home')
  }

  const result = await getDocumentContent(documentId)

  if (result.error || !result.content) {
    redirect('/home')
  }

  return (
    <div>
      <AuthenticatedNavbar userName={user.name || 'User'} userEmail={user.email} />
      <DocumentLoader content={result.content} userId={user.id.toString()} userName={user.name || 'User'} />
      <MainContainer documentId={documentId} documentTitle={result.title || 'Untitled.md'} />
    </div>
  )
}
