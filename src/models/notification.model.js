import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member", // or Admin
    required: true
  },
  role: {
    type: String,
    enum: ["Member", "Admin"],
    required: true
  },
  type: {
    type: String,
    enum: ["overdue", "reminder", "success", "info"],
    required: true
  },
  title: String,
  message: String,
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model("Notification", notificationSchema);