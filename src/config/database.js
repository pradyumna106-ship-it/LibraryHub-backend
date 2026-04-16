import mongoose from "mongoose";
import { DB_NAME } from "./constant";


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
export const connectDB = async () => {
  try {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(
        "mongodb+srv://pradyumnajekumar_db_user:OOUAMTsOKJamEdD1@cluster0.5xvzjta.mongodb.net",
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