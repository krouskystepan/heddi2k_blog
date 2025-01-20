import { Schema, model, models, Document } from 'mongoose'

export interface IPost extends Document {
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Post = models.Post || model<IPost>('Post', PostSchema)

export default Post
