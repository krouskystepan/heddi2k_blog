'use server'

import Admin from '@/database/admin.model'
import { connectToDatabase } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcrypt'

export async function getAdmin({ username }: { username: string }) {
  try {
    await connectToDatabase()

    const admin = await Admin.findOne({ username })

    revalidatePath('/')
    return admin
  } catch (error) {
    console.error(error)
  }
}

export async function createAdmin({
  username,
  password,
}: {
  username: string
  password: string
}) {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    await connectToDatabase()

    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      throw new Error('Username already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await Admin.create({ username, password: hashedPassword })
    console.log(`Admin ${username} created`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error creating admin:', error)
  }
}
