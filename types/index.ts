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

export type TKrakenState = {
  status:
    | 'fed'
    | 'full'
    | 'starting_to_get_hungry'
    | 'hungry'
    | 'very_hungry'
    | 'angry'
    | 'very_angry'
  remainingTime: number
  timeline: { status: TKrakenState['status']; time: number }[]
  startTime: number
}

export type TKrakenPhase = {
  status: string
  time: number
}

export type TKraken = {
  status: TKrakenState['status']
  startTime: number
  timeline: TKrakenPhase[]
  remainingTime: number
}
