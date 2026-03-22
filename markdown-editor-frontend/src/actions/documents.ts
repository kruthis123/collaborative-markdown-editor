'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function getOwnedDocuments() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        owner_id: user.id
      },
      select: {
        id: true,
        title: true,
        storage_path: true,
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    })

    return { documents }
  } catch (error) {
    console.error('Error fetching owned documents:', error)
    return { error: 'Failed to fetch documents' }
  }
}

export async function getSharedDocuments() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const sharedAccess = await prisma.documentAccess.findMany({
      where: {
        user_id: user.id
      },
      select: {
        document: {
          select: {
            id: true,
            title: true,
            storage_path: true,
            owner: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    const documents = sharedAccess.map((access) => access.document)

    return { documents }
  } catch (error) {
    console.error('Error fetching shared documents:', error)
    return { error: 'Failed to fetch shared documents' }
  }
}

export async function getDocumentContent(documentId: number) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        OR: [
          { owner_id: user.id },
          { access: { some: { user_id: user.id } } }
        ]
      },
      select: {
        id: true,
        title: true,
        storage_path: true
      }
    })

    if (!document) {
      return { error: 'Document not found or access denied' }
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://192.168.68.50:8001'
    const response = await fetch(`${backendUrl}/file/${document.storage_path}`)
    
    if (!response.ok) {
      return { error: 'Failed to fetch file content from backend' }
    }

    const content = await response.text()

    return { 
      content,
      title: document.title,
      storage_path: document.storage_path
    }
  } catch (error) {
    console.error('Error fetching document content:', error)
    return { error: 'Failed to fetch document content' }
  }
}

export async function saveDocumentContent(documentId: number, content: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        OR: [
          { owner_id: user.id },
          { access: { some: { user_id: user.id } } }
        ]
      },
      select: {
        id: true,
        storage_path: true
      }
    })

    if (!document) {
      return { error: 'Document not found or you do not have permission to edit' }
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://192.168.68.50:8001'
    const response = await fetch(`${backendUrl}/file/${document.storage_path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })
    
    if (!response.ok) {
      return { error: 'Failed to save file to backend' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving document content:', error)
    return { error: 'Failed to save document content' }
  }
}
