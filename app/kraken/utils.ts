import { KrakenState, KrakenData } from './types'

export const LOGGING = false

const HOUR = 60 * 60
export const MIN_KRAKEN_TIME = HOUR * 3
export const MAX_KRAKEN_TIME = HOUR * 6

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

export const generateTimeline = (): {
  status: KrakenState['status']
  time: number
}[] => {
  const totalStates = krakenStates.length
  const randomTime =
    Math.floor(Math.random() * (MAX_KRAKEN_TIME - MIN_KRAKEN_TIME + 1)) +
    MIN_KRAKEN_TIME

  let remainingTime = randomTime
  const timeline: { status: KrakenState['status']; time: number }[] = []

  for (let i = 0; i < totalStates - 1; i++) {
    const status = krakenStates[i]

    const maxRandom = Math.min(
      remainingTime - (totalStates - 2 - i),
      remainingTime / 2
    )
    const time = Math.floor(Math.random() * maxRandom) + 1

    timeline.push({ status, time })
    remainingTime -= time
  }

  timeline.push({ status: 'very_angry', time: 0 })

  return timeline
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
