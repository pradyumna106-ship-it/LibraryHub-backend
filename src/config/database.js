import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import dotenv from 'dotenv/config';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
export const connectDB = async () => {
  try {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(
        process.env.MONGODB_URI,
        { dbName: DB_NAME,bufferCommands: false }
      );
    }
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  }
};