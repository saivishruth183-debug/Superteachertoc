import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    short: { type: String, required: true, trim: true, maxlength: 5 },
    color: {
      type: String,
      required: true,
      enum: ['coral', 'lime', 'sky', 'violet', 'yellow'],
    },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Course', courseSchema)