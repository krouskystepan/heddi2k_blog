import { KrakenState, KrakenData } from './types'

/*
LOGGING cheatsheet:
Zelená: Fetch data
Oranžová: Play audio
Modrá: Generovaní dat
Růžová: Akce uživatele
*/
export const LOGGING = true

// 5 Phases of Kraken (plus fed and very_angry = no time)
const MINUTE = 60
const MIN_KRAKEN_PHASE_TIME = MINUTE * 10
const MAX_KRAKEN_PHASE_TIME = MINUTE * 105

export const krakenStates: KrakenState['status'][] = [
  'full',
  'starting_to_get_hungry',
  'hungry',
  'very_hungry',
  'angry',
  'very_angry',
]

export const krakenInitialState: KrakenData = {
  status: 'fed',
  remainingTime: 0,
  timeline: [],
  startTime: 0,
}

export const krakenStateColors: Record<KrakenState['status'], string> = {
  fed: '#009E60', // Green
  full: '#50C878', // Light Green
  starting_to_get_hungry: '#FDDA0D', // Yellow
  hungry: '#FEA813', // Orange
  very_hungry: '#FF7518', // Red
  angry: '#A70F2B', // Dark Red
  very_angry: '#7B0816', // Intense Dark Red
}

export const krakenStateAudio: Record<
  Exclude<KrakenState['status'], 'fed' | 'full'>,
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
  status: KrakenState['status']
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

const getElapsedTime = (krakenData: KrakenData) => {
  if (!krakenData.startTime) return 0
  const currentTimestamp = Date.now()
  return Math.floor((currentTimestamp - krakenData.startTime) / 1000)
}

export const getCurrentPhase = (
  krakenData: KrakenData
): {
  status: KrakenState['status']
  time: number
} => {
  const elapsedSinceStart = getElapsedTime(krakenData)

  if (!krakenData.timeline || krakenData.timeline.length === 0) {
    return {
      status: 'fed',
      time: 0,
    }
  }

  let accumulatedTime = 0

  for (const phase of krakenData.timeline) {
    if (
      elapsedSinceStart >= accumulatedTime &&
      elapsedSinceStart < accumulatedTime + phase.time
    ) {
      return {
        status: phase.status as KrakenState['status'],
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

export const getRemainingTime = (krakenData: KrakenData) => {
  let accumulatedTime = 0
  const elapsedSinceStart = getElapsedTime(krakenData)

  for (const phase of krakenData.timeline) {
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
