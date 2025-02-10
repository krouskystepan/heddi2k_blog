'use server'

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/firebase'
import { TPost } from '@/types'

export const createPost = async ({
  title,
  description,
  imageLink,
}: {
  title: string
  description: string
  imageLink?: string
}) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const postRef = doc(collection(db, 'posts'))
    await setDoc(postRef, {
      title,
      description,
      imageLink,
      createdAt: new Date().toISOString(),
    })
    console.log(`Post '${title}' created`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error creating post:', error)
  }
}

export const deletePost = async (id: string) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const postRef = doc(db, 'posts', id)
    await deleteDoc(postRef)
    console.log(`Post '${id}' deleted`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

export const getPostById = async (id: string): Promise<TPost | undefined> => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const postRef = doc(db, 'posts', id)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      throw new Error('Post not found')
    }

    const post = postSnap.data() as TPost
    return { ...post, id: postSnap.id }
  } catch (error) {
    console.error('Error getting post:', error)
  }
}

export const updatePostById = async (
  id: string,
  data: { title: string; description: string; imageLink?: string }
) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const postRef = doc(db, 'posts', id)
    await updateDoc(postRef, { ...data, updatedAt: new Date().toISOString() })
    console.log(`Post '${id}' updated`)

    revalidatePath('/perlicky')
  } catch (error) {
    console.error('Error updating post:', error)
  }
}

// No perms
export const getPosts = async (): Promise<TPost[] | undefined> => {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    )
    const postsSnap = await getDocs(postsQuery)

    return postsSnap.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageLink: data.imageLink,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as TPost
    })
  } catch (error) {
    console.error('Error getting posts:', error)
  }
}
