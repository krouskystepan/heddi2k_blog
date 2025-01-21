import { Schema, model, models, Document } from 'mongoose'

export interface IPost extends Document {
  title: string
  description: string
  imageLink: string
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
    imageLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Post = models.Post || model<IPost>('Post', PostSchema)

export default Post
