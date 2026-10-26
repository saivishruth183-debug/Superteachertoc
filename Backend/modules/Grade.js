import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    pdf: {
      url: { type: String, default: null },
      originalName: { type: String, default: null },
      fileId: { type: String, default: null },
    },
  },
  { timestamps: true }
);

gradeSchema.index({ course: 1, slug: 1 }, { unique: true });

export default mongoose.model("Grade", gradeSchema);