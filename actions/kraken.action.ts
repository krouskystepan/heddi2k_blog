'use server'

import { KRAKEN_DOC_ID, krakenStates } from '@/app/kraken/utils'
import { getServerSession } from 'next-auth'
import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { TKraken } from '@/types'

export async function startKraken(
  timeline: {
    status: TKraken['status']
    time: number
  }[],
  startTime: number
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new Error('Not logged in!')
    }

    const krakenRef = doc(db, 'kraken', KRAKEN_DOC_ID)
    const krakenSnap = await getDoc(krakenRef)

    if (!krakenSnap.exists()) {
      throw new Error('Kraken not found!')
    }

    const kraken = krakenSnap.data()

    if (kraken.startTime !== 0) {
      console.error('Kraken already started!')
      return
    }

    await updateDoc(krakenRef, { startTime, timeline, lastFeed: 0 })
  } catch (error) {
    console.error('Error starting Kraken:', error)
    throw error
  }
}

export async function feedKraken() {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new Error('Not logged in!')
    }

    const krakenRef = doc(db, 'kraken', KRAKEN_DOC_ID)
    const krakenSnap = await getDoc(krakenRef)

    if (!krakenSnap.exists()) {
      throw new Error('Kraken not found!')
    }

    const kraken = krakenSnap.data()

    if (kraken.startTime === 0) {
      console.error('Kraken already fed!')
      return
    }

    await updateDoc(krakenRef, {
      startTime: 0,
      timeline: [],
      lastFeed: Date.now(),
      feedCounter: increment(1),
    })
  } catch (error) {
    console.error('Error feeding Kraken:', error)
    throw error
  }
}

export async function getKrakenStatus(): Promise<TKraken> {
  try {
    const krakenRef = doc(db, 'kraken', KRAKEN_DOC_ID)
    let krakenSnap = await getDoc(krakenRef)

    if (!krakenSnap.exists()) {
      const defaultKraken = {
        startTime: 0,
        timeline: [],
        lastFeed: 0,
        feedCounter: 0,
      }
      await setDoc(krakenRef, defaultKraken)
      krakenSnap = await getDoc(krakenRef)
    }

    const kraken = krakenSnap.data()
    if (!kraken) {
      throw new Error('Unexpected error: Kraken data is undefined')
    }

    if (kraken.startTime === 0) {
      return {
        status: 'fed',
        remainingTime: 0,
        startTime: kraken.startTime,
        lastFeed: kraken.lastFeed,
        feedCounter: kraken.feedCounter,
        timeline: kraken.timeline,
      }
    }

    const timeline = [...kraken.timeline].sort(
      (a: { status: TKraken['status'] }, b: { status: TKraken['status'] }) =>
        krakenStates.indexOf(a.status) - krakenStates.indexOf(b.status)
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
      status: currentPhase.status,
      remainingTime: Math.floor(Math.max(0, remainingTime) / 1000),
      startTime: kraken.startTime,
      lastFeed: kraken.lastFeed,
      feedCounter: kraken.feedCounter,
      timeline: JSON.parse(JSON.stringify(timeline)),
    }
  } catch (error) {
    console.error('Error fetching Kraken status:', error)
    throw error
  }
}
