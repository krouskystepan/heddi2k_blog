import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = new MongoClient(process.env.MONGO_URI as string)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  const collection = db.collection('krakens')

  // Create a change stream to listen for MongoDB changes
  const changeStream = collection.watch()

  // Set up the SSE response
  const readableStreamDefaultWriter = new ReadableStream({
    start(controller) {
      changeStream.on('change', (change) => {
        // Push each MongoDB change as an SSE message
        controller.enqueue(`data: ${JSON.stringify(change)}\n\n`)
      })

      // Handle stream closure
      changeStream.on('close', () => {
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
