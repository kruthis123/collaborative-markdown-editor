import AuthenticatedNavbar from '@/ui/components/AuthenticatedNavbar'
import MainContainer from '@/ui/components/MainContainer'
import DocumentLoader from '@/ui/components/DocumentLoader'
import { getCurrentUser } from '@/app/lib/session'
import { getDocumentContent } from '@/app/actions/documents'
import { redirect } from 'next/navigation'

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default async function EditorPage({ params }: Readonly<EditorPageProps>) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const documentId = Number.parseInt(params.id)
  
  if (Number.isNaN(documentId)) {
    redirect('/home')
  }

  const result = await getDocumentContent(documentId)

  if (result.error || !result.content) {
    redirect('/home')
  }

  return (
    <div>
      <AuthenticatedNavbar userName={user.name} userEmail={user.email} documentId={documentId} />
      <DocumentLoader content={result.content} userId={user.id.toString()} userName={user.name} />
      <MainContainer />
    </div>
  )
}
