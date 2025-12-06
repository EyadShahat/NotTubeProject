import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatarUrl: { type: String, default: "" },
  accountStatus: { type: String, enum: ["active", "flagged"], default: "active" },
  bio: { type: String, default: "" },
  likedVideos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  savedVideos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  watchedVideos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  subscriptions: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
