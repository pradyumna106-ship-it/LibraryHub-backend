import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  // if (!process.env.MONGODB_URI) {
  //   throw new Error("MONGODB_URI is missing");
  // }

  const conn = await mongoose.connect("mongodb+srv://pradyumnajekumar_db_user:OOUAMTsOKJamEdD1@cluster0.5xvzjta.mongodb.net/library", {
    bufferCommands: false,
  });

  isConnected = conn.connections[0].readyState === 1;
  console.log("MongoDB connected");
};