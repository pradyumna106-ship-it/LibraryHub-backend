import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: DB_NAME
      }
    );

    console.log(`✅ MongoDB Connected!!! ${connectionInstance.connection.host}`);
    
  } catch (error) {
    console.error("❌ Connection Failed!!!", error.message);
    process.exit(1);
  }
};

export default connectDB;