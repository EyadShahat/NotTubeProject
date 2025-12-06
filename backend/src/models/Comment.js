import mongoose from "mongoose";

const { Schema } = mongoose;

const CommentSchema = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  hidden: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);
