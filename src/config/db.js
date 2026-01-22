import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  try {
    // establish connection
    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || "fertilizer_management_system",
    });

    console.log(`Database connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1); // exit process if connection fails
  }
};
