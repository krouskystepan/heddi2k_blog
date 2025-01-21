'use server'

import Post from '@/database/post.model'
import { connectToDatabase } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export const createPost = async ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    await connectToDatabase()

    await Post.create({ title, description })
    console.log(`Post '${title}' created`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error creating post:', error)
  }
}

export const getPosts = async () => {
  try {
    await connectToDatabase()

    const posts = await Post.find().sort({ createdAt: -1 })
    return posts
  } catch (error) {
    console.error('Error getting posts:', error)
  }
}
