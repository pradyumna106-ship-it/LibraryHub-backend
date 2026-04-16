import mongoose from "mongoose";
import { DB_NAME } from "./constant";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(
      "mongodb+srv://pradyumnajekumar_db_user:OOUAMTsOKJamEdD1@cluster0.5xvzjta.mongodb.net",
      { dbName: DB_NAME,bufferCommands: false }
    );

    isConnected = conn.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  }
};