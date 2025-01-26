import { Schema, models, model, Document } from 'mongoose'

interface DocumentTimeline {
  status: string
  time: number
}

export interface IKraken extends Document {
  startTime: number
  timeline: DocumentTimeline[]
}

const TimelineSchema = new Schema<DocumentTimeline>({
  status: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
})

const KrakenSchema = new Schema<IKraken>({
  startTime: {
    type: Number,
    required: true,
    default: Date.now,
  },
  timeline: {
    type: [TimelineSchema],
    required: true,
    default: [],
  },
})

const Kraken = models.Kraken || model<IKraken>('Kraken', KrakenSchema)

export default Kraken
