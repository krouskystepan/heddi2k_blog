import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = new MongoClient(process.env.MONGO_URI as string)
  await client.connect()
  const db = client.db(process.env.DB_NAME)
  const collection = db.collection('krakens')

  const changeStream = collection.watch()

  let controllerClosed = false

  const readableStream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        if (controllerClosed) return
        try {
          controller.enqueue('Keeping connection alive...')
        } catch (err) {
          console.error('Error enqueuing keep-alive message:', err)
        }
      }, 30000)

      changeStream.on('change', () => {
        if (controllerClosed) return
        try {
          controller.enqueue('Document updated')
        } catch (err) {
          console.error('Error enqueuing change event:', err)
        }
      })

      changeStream.on('close', () => {
        cleanup(interval, controller, 'close')
      })

      changeStream.on('error', (error) => {
        console.error('ChangeStream error:', error)
        cleanup(interval, controller, 'error')
      })
    },
    cancel() {
      changeStream.close()
      if (!controllerClosed) {
        cleanup(null, null, 'cancel')
      }
    },
  })

  function cleanup(
    interval: NodeJS.Timeout | null,
    controller: ReadableStreamDefaultController | null,
    eventType: string
  ) {
    if (controllerClosed) return
    controllerClosed = true

    if (interval) clearInterval(interval)

    if (controller) {
      try {
        if (eventType === 'error') {
          controller.error(new Error('Stream error occurred'))
        } else {
          if (!controllerClosed) {
            controller.close()
          }
        }
      } catch (err) {
        console.error(`Error closing controller during ${eventType}:`, err)
      }
    }
  }

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
