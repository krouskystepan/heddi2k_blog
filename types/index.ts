import { KrakenPhase, KrakenState } from '@/app/kraken/types'

export type TAdmin = {
  username: string
  password: string
}

export type TPost = {
  id: string
  title: string
  description: string
  imageLink: string
  createdAt: Date
  updatedAt: Date
}
export type TKraken = {
  startTime: number
  timeline: KrakenPhase[]
  currentPhase: KrakenState['status']
  remainingTime: number
}
