export type KrakenState = {
  status:
    | 'fed'
    | 'full'
    | 'starting_to_get_hungry'
    | 'hungry'
    | 'very_hungry'
    | 'angry'
    | 'very_angry'
  remainingTime: number
  timeline: { status: KrakenState['status']; time: number }[]
  startTime: number
}

export interface KrakenData {
  status: KrakenState['status']
  remainingTime: number
  timeline: KrakenPhase[]
  startTime: number
}

export interface KrakenPhase {
  status: string
  time: number
}
