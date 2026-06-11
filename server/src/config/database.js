import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/agentic-hire-ai";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}
