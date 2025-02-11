'use server'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/firebase'

export async function getAdmin({ username }: { username: string }) {
  try {
    const adminRef = doc(db, 'admins', username)
    const adminSnap = await getDoc(adminRef)

    if (adminSnap.exists()) {
      revalidatePath('/')
      return adminSnap.data()
    } else {
      throw new Error('Admin not found')
    }
  } catch (error) {
    console.error('Error fetching admin:', error)
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

    const adminRef = doc(db, 'admins', username)
    const adminSnap = await getDoc(adminRef)

    if (adminSnap.exists()) {
      throw new Error('Username already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await setDoc(adminRef, { username, password: hashedPassword })
    console.log(`Admin ${username} created`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error creating admin:', error)
  }
}

export async function changePassword({
  username,
  oldPassword,
  newPassword,
}: {
  username: string
  oldPassword: string
  newPassword: string
}) {
  try {
    const session = await getServerSession()
    if (!session?.user?.name) {
      throw new Error('Not logged in')
    }

    const adminRef = doc(db, 'admins', username)
    const adminSnap = await getDoc(adminRef)

    if (!adminSnap.exists()) {
      throw new Error('Admin not found')
    }

    const admin = adminSnap.data()
    const passwordMatch = await bcrypt.compare(oldPassword, admin.password)
    console.log('adminSnap', oldPassword, admin.password, passwordMatch)

    if (!passwordMatch) {
      throw new Error('Old password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await setDoc(adminRef, { username, password: hashedPassword })
    console.log(`Password for ${username} changed`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error changing password:', error)
  }
}
