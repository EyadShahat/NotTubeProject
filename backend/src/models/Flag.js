import mongoose from "mongoose";

const { Schema } = mongoose;

const FlagSchema = new Schema({
  type: { type: String, enum: ["video", "account", "comment"], required: true },
  targetId: { type: String, required: true },
  reason: { type: String, required: true },
  message: { type: String, default: "" },
  status: { type: String, enum: ["open", "in_review", "resolved"], default: "open" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  resolution: { type: String, default: "" },
  outcome: { type: String, enum: ["pending", "accepted", "denied"], default: "pending" },
  appealMessage: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Flag", FlagSchema);
