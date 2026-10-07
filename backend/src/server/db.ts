import mongoose from "mongoose";
import { seedIfEmpty } from "./seed";

// Cached across hot reloads / serverless invocations.
const g = globalThis as unknown as { __mongo?: Promise<typeof mongoose> };

export function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (see .env.example)");
  g.__mongo ??= mongoose
    .connect(uri, { serverSelectionTimeoutMS: 8000 })
    .then(async (m) => {
      await seedIfEmpty();
      return m;
    })
    .catch((e) => {
      g.__mongo = undefined; // allow retry on the next request
      throw e;
    });
  return g.__mongo;
}
