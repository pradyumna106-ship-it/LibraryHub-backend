import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
  });

  isConnected = conn.connections[0].readyState === 1;
  console.log("MongoDB connected");
};