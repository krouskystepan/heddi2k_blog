'use server'

import Post, { IPost } from '@/database/post.model'
import { connectToDatabase } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

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

    await connectToDatabase()

    await Post.create({ title, description, imageLink })
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

    await connectToDatabase()

    await Post.findByIdAndDelete(id)
    console.log(`Post '${id}' deleted`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

export const getPostById = async (id: string) => {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    await connectToDatabase()

    const post = await Post.findById(id).lean<IPost>()

    if (!post) {
      throw new Error('Post not found')
    }

    const serializedPost = {
      ...post,
      _id: (post._id as unknown as string).toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }

    return serializedPost
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

    await connectToDatabase()

    await Post.findByIdAndUpdate(id, data)
    console.log(`Post '${id}' updated`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error updating post:', error)
  }
}

// No perms
export const getPosts = async () => {
  try {
    await connectToDatabase()

    const posts = await Post.find().sort({ createdAt: -1 })
    return posts
  } catch (error) {
    console.error('Error getting posts:', error)
  }
}
