import { setServers } from "node:dns";
import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (dnsServers?.length) {
      setServers(dnsServers);
    }

    connectionPromise = mongoose.connect(uri).then(() => {
      console.log("MongoDB connected successfully");
      return mongoose;
    });

    return await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};
