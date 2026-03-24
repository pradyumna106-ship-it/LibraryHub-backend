import { Schema, model } from "mongoose";

const publisherSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

export const Publisher = model("Publisher", publisherSchema);