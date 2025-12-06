import mongoose from "mongoose";

const { Schema } = mongoose;

const VideoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  src: { type: String, required: true }, // direct MP4 or streamable URL
  length: { type: String, default: "0:00" },
  thumb: { type: String, default: "" },
  channelName: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  views: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  hidden: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Video", VideoSchema);
