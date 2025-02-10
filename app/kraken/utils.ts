/*
LOGGING cheatsheet:
Zelená: Fetch data
Oranžová: Play audio
Modrá: Generovaní dat
Růžová: Akce uživatele
*/

import { TKraken, TKrakenPhase } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasPermsForLogs = (session: any) => {
  return session.data?.user?.name === 'Admin'
}

// 5 Phases of Kraken (plus fed and very_angry = no time)
const MINUTE = 60
const MIN_KRAKEN_PHASE_TIME = MINUTE * 15
const MAX_KRAKEN_PHASE_TIME = MINUTE * 90

// Do not change this value
export const KRAKEN_DOC_ID = 'kraken'

export const krakenStates: TKraken['status'][] = [
  'full',
  'starting_to_get_hungry',
  'hungry',
  'very_hungry',
  'angry',
  'very_angry',
]

export const krakenInitialState: TKraken = {
  status: 'fed',
  remainingTime: 0,
  startTime: 0,
  lastFeed: 0,
  feedCounter: 0,
  timeline: [],
}

export const krakenStateColors: Record<TKraken['status'], string> = {
  fed: '#0047AB',
  full: '#009E60',
  starting_to_get_hungry: '#FDDA0D',
  hungry: '#FEA813',
  very_hungry: '#FF7518',
  angry: '#A70F2B',
  very_angry: '#880808',
}

export const krakenStateAudio: Record<
  Exclude<TKraken['status'], 'fed' | 'full'>,
  { source: string; volume: number }
> = {
  starting_to_get_hungry: {
    source: '/sounds/starting_to_get_hungry.mp3',
    volume: 0.15,
  },
  hungry: {
    source: '/sounds/hungry.mp3',
    volume: 0.3,
  },
  very_hungry: {
    source: '/sounds/very_hungry.mp3',
    volume: 0.5,
  },
  angry: {
    source: '/sounds/angry.mp3',
    volume: 0.75,
  },
  very_angry: {
    source: '/sounds/very_angry.mp3',
    volume: 1,
  },
}

export const generateTimeline = (): {
  status: TKraken['status']
  time: number
}[] => {
  const getRandomTime = () =>
    Math.floor(
      Math.random() * (MAX_KRAKEN_PHASE_TIME - MIN_KRAKEN_PHASE_TIME + 1)
    ) + MIN_KRAKEN_PHASE_TIME

  return krakenStates.map((state) => ({
    status: state,
    time: state === 'very_angry' ? 0 : getRandomTime(),
  }))
}

const getElapsedTime = (startTime: number) => {
  if (!startTime) return 0
  const currentTimestamp = Date.now()
  return Math.floor((currentTimestamp - startTime) / 1000)
}

export const getCurrentPhase = (
  startTime: number,
  timeline: TKrakenPhase[]
): {
  status: TKraken['status']
  time: number
} => {
  const elapsedSinceStart = getElapsedTime(startTime)

  if (!timeline || timeline.length === 0) {
    return {
      status: 'fed',
      time: 0,
    }
  }

  let accumulatedTime = 0

  for (const phase of timeline) {
    if (
      elapsedSinceStart >= accumulatedTime &&
      elapsedSinceStart < accumulatedTime + phase.time
    ) {
      return {
        status: phase.status as TKraken['status'],
        time: phase.time,
      }
    }
    accumulatedTime += phase.time
  }

  if (elapsedSinceStart >= accumulatedTime) {
    return { status: 'very_angry', time: 0 }
  }

  return {
    status: 'fed',
    time: 0,
  }
}

export const getRemainingTime = (
  startTime: number,
  timeline: TKrakenPhase[]
) => {
  let accumulatedTime = 0
  const elapsedSinceStart = getElapsedTime(startTime)

  for (const phase of timeline) {
    if (
      elapsedSinceStart >= accumulatedTime &&
      elapsedSinceStart < accumulatedTime + phase.time
    ) {
      return phase.time - (elapsedSinceStart - accumulatedTime)
    }
    accumulatedTime += phase.time
  }
  return 0
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  const parts = []

  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`)

  return parts.join(' ')
}

export function timeSince(
  date: Date,
  suffixes = { M: 'M', d: 'd', h: 'h', m: 'm', s: 's' }
): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)

  if (diffSeconds < 60) return `${diffSeconds}${suffixes.s}`

  const months = Math.floor(diffMs / 2629800000)
  const days = Math.floor((diffMs % 2629800000) / 86400000)
  const hours = Math.floor((diffMs % 86400000) / 3600000)
  const minutes = Math.floor((diffMs % 3600000) / 60000)

  if (months > 0) return `${months}${suffixes.M} ${days}${suffixes.d}`.trim()
  if (days > 0) return `${days}${suffixes.d} ${hours}${suffixes.h}`.trim()
  if (hours > 0) return `${hours}${suffixes.h} ${minutes}${suffixes.m}`.trim()
  return `${minutes}${suffixes.m}`
}
