'use server'

import { db } from '@/lib/firebase'
import { TStatement } from '@/types'
import {
  doc,
  collection,
  setDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export const createStatement = async ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  try {
    console.log(title, description)

    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const statementRef = doc(collection(db, 'statements'))
    await setDoc(statementRef, {
      title,
      description,
      createdAt: new Date().toISOString(),
    })
    console.log(`Statement '${title}' created`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error creating statement:', error)
  }
}

export const deleteStatement = async (id: string) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const statementRef = doc(db, 'statements', id)
    await deleteDoc(statementRef)
    console.log(`Statement '${id}' deleted`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting statement:', error)
  }
}

export const updateStatementById = async (
  id: string,
  data: { title: string; description: string }
) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const statementRef = doc(db, 'statements', id)
    await updateDoc(statementRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
    console.log(`Statement '${id}' updated`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error updating statement:', error)
  }
}

export const getStatementById = async (
  id: string
): Promise<TStatement | undefined> => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const statementRef = doc(db, 'statements', id)
    const statementSnap = await getDoc(statementRef)

    if (!statementSnap.exists()) {
      throw new Error('Statement not found')
    }

    const statement = statementSnap.data() as TStatement
    return { ...statement, id: statementSnap.id }
  } catch (error) {
    console.error('Error getting statement:', error)
  }
}

// Not perms
export const getAllStatements = async (): Promise<TStatement[] | undefined> => {
  try {
    const postsQuery = query(
      collection(db, 'statements'),
      orderBy('createdAt', 'desc')
    )
    const postsSnap = await getDocs(postsQuery)

    return postsSnap.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
      } as TStatement
    })
  } catch (error) {
    console.error('Error getting statements:', error)
  }
}
