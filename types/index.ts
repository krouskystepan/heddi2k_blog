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
}

export type TStatement = {
  id: string
  title: string
  description: string
  createdAt: Date
}

type TStatus =
  | 'fed'
  | 'full'
  | 'starting_to_get_hungry'
  | 'hungry'
  | 'very_hungry'
  | 'angry'
  | 'very_angry'

export type TKrakenPhase = {
  status: TStatus
  time: number
}

export type TKraken = {
  status: TStatus
  startTime: number
  remainingTime: number
  lastFeed: number
  feedCounter: number
  timeline: TKrakenPhase[]
}
