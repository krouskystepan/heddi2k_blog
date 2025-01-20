import mongoose from 'mongoose'

let isConnected: boolean = false

export async function connectToDatabase() {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGO_URI) {
    console.log('MISSING MONGO_URI')
    return
  }

  if (isConnected) {
    console.log('MongoDB is already connected')
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    isConnected = true
    console.log('MongoDB is connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
  }
}
