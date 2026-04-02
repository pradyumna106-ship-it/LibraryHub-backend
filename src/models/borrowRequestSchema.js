import { Schema, model } from "mongoose";

const borrowRequestSchema = new Schema({
   memberId: {
    type: Schema.Types.ObjectId,
    ref: "Member", // 🔥 reference
    required: true
  },

  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book", // 🔥 reference
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected","Completed"],
    default: "Pending"
  }
}, { timestamps: true });

export const BorrowRequest = model("BorrowRequest", borrowRequestSchema);