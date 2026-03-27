import { Schema, model } from "mongoose";

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  author: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true
  },

  available: {
    type: Boolean,
    default: true
  },

  ISBN: {
    type: String,
    required: true,
    unique: true, // ✅ important
    trim: true
  },

  image: {
    type: String, // URL or local path
    default: ""
  },
  publisherId: {
    type: Schema.Types.ObjectId, // ✅ better than String
    ref: "Publisher",
    required: true
  }

}, {
  timestamps: true // ✅ adds createdAt & updatedAt
});

export const Book = model("Book", bookSchema);