import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = new MongoClient(process.env.MONGO_URI as string)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  const collection = db.collection('krakens')

  const changeStream = collection.watch()

  const readableStreamDefaultWriter = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        controller.enqueue('Keeping connection alive...')
      }, 30000)

      changeStream.on('change', () => {
        controller.enqueue(`Document updated`)
      })

      changeStream.on('close', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new NextResponse(readableStreamDefaultWriter, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
