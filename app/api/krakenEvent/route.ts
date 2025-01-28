import Kraken from '@/database/kraken.model'
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!process.env.MONGO_URI)
    return new NextResponse('MONGO_URI is not defined', { status: 500 })

  const client = new MongoClient(process.env.MONGO_URI)
  await client.connect()

  const changeStream = Kraken.watch()
  let streamClosed = false

  const readableStream = new ReadableStream({
    start(controller) {
      changeStream.on('change', (change) => {
        if (!streamClosed) {
          controller.enqueue(`data: ${JSON.stringify(change)}\n\n`)
        }
      })

      changeStream.on('close', () => {
        if (!streamClosed) {
          streamClosed = true
          controller.close()
        }
      })

      changeStream.on('error', (error) => {
        if (!streamClosed) {
          streamClosed = true
          controller.error(error)
        }
      })
    },
    cancel() {
      streamClosed = true
      changeStream.close()
    },
  })

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
