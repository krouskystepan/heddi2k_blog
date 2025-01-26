'use server'

import { KrakenState } from '@/app/kraken/types'
import { krakenStates } from '@/app/kraken/utils'
import Kraken from '@/database/kraken.model'
import { connectToDatabase } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function startKraken(
  timeline: {
    status: KrakenState['status']
    time: number
  }[],
  startTime: number
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new Error('Not logged in!')
    }

    await connectToDatabase()

    const kraken = await Kraken.findOne()

    if (!kraken) {
      await Kraken.create({ status: 'full', startTime, timeline })
    } else {
      await Kraken.updateOne({ status: 'full', startTime, timeline })
    }
  } catch (error) {
    console.log(error)
  }
}

export async function feedKraken() {
  try {
    await connectToDatabase()

    const kraken = await Kraken.findOne()

    if (!kraken) {
      throw new Error('Kraken not found!')
    }

    await Kraken.updateOne({ status: 'fed', startTime: 0, timeline: [] })
  } catch (error) {
    console.error('Error feeding Kraken:', error)
    throw error
  }
}

export async function getKrakenStatus() {
  try {
    await connectToDatabase()

    let kraken = await Kraken.findOne()

    if (!kraken) {
      kraken = new Kraken({ status: 'fed', startTime: 0, timeline: [] })
      await kraken.save()
    }

    if (kraken.status === 'fed' || kraken.startTime === 0) {
      return {
        currentPhase: 'fed',
        remainingTime: 0,
        timeline: [],
        startTime: 0,
      }
    }

    const timeline = [...kraken.timeline].sort(
      (
        a: { status: KrakenState['status'] },
        b: { status: KrakenState['status'] }
      ) => krakenStates.indexOf(a.status) - krakenStates.indexOf(b.status)
    )

    const currentTime = Date.now()
    const elapsedTime = currentTime - kraken.startTime
    let accumulatedTime = 0
    let currentPhase = null
    let remainingTime = 0

    for (const phase of timeline) {
      accumulatedTime += phase.time * 1000

      if (elapsedTime < accumulatedTime) {
        currentPhase = phase
        remainingTime = accumulatedTime - elapsedTime
        break
      }
    }

    if (!currentPhase) {
      currentPhase = { status: 'very_angry', time: 0 }
      remainingTime = 0
    }

    return {
      currentPhase: currentPhase.status,
      remainingTime: Math.floor(Math.max(0, remainingTime) / 1000),
      timeline: JSON.parse(JSON.stringify(timeline)),
      startTime: kraken.startTime,
    }
  } catch (error) {
    console.error('Error fetching Kraken status:', error)
    throw error
  }
}
