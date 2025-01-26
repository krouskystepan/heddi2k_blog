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
      changeStream.on('change', (change) => {
        controller.enqueue(`data: ${JSON.stringify(change)}\n\n`)
      })

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
