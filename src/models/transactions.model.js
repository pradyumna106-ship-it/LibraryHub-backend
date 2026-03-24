import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
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

  issueDate: {
    type: Date,
    default: Date.now
  },

  dueDate: {
    type: Date,
    required: true
  },

  returnDate: {
    type: Date,
    default: null
  },

  fineAmount: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["Issued", "Returned", "Overdue"],
    default: "Issued"
  }

}, {
  timestamps: true
});

export const Transaction = model("Transaction", transactionSchema);