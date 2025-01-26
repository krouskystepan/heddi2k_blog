import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = new MongoClient(process.env.MONGO_URI as string)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  const collection = db.collection('krakens')

  const pipeline = [
    { $match: { operationType: { $in: ['insert', 'update'] } } },
  ]

  const changeStream = collection.watch(pipeline)

  const readableStreamDefaultWriter = new ReadableStream({
    start(controller) {
      changeStream.on('change', () => {
        controller.enqueue(`Document updated\n`)
      })

      changeStream.on('close', () => {
        controller.close()
        client.close()
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
