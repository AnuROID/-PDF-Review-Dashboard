import mongoose from "mongoose";

let gfs: mongoose.mongo.GridFSBucket;

const connectDB = async () => {
  try {
    // Connect to MongoDB via Mongoose
    const conn = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("MongoDB connected");

    const db = conn.connection.db;
     if (!db) throw new Error("Database connection not ready");
    gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
    console.log("GridFS ready");
  } catch (err) {
    console.error("MongoDB connnow cn ection error:", err);
    process.exit(1);
  }
};

// Getter to access GridFSBucket safely
export const getGFS = () => {
  if (!gfs) throw new Error("GridFS not initialized");
  return gfs;
};

export default connectDB;
