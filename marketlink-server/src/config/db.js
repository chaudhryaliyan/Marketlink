import mongoose from "mongoose";

const RETRY_MS = 5000;
const DEFAULT_URI = "mongodb://localhost:27017/marketlink";

const explain = (err) => {
  const msg = err?.message || "";
  if (/ECONNREFUSED|ENOTFOUND/i.test(msg)) {
    return "Cannot reach MongoDB. For local Compass use mongodb://localhost:27017/marketlink and make sure the MongoDB Server service is running. For Atlas, check Network Access/IP allowlist and the URI.";
  }
  if (/bad auth|Authentication failed/i.test(msg)) return "Wrong database username or password in MONGO_URI.";
  if (/querySrv|ETIMEOUT|Server selection timed out|tls|SSL|TLS/i.test(msg)) {
    return `MongoDB network/TLS connection failed. Check MONGO_URI and Atlas Network Access. Original: ${msg}`;
  }
  return msg;
};

const connectDB = async () => {
  const uri = String(process.env.MONGO_URI || DEFAULT_URI).trim();

  // Avoid opening a second connection when a retry races with an already-connected client.
  if (mongoose.connection.readyState === 1) return true;
  if ([2, 3].includes(mongoose.connection.readyState)) return true;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      family: 4,
      maxPoolSize: 10,
    });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name || "marketlink"}`);
    return true;
  } catch (err) {
    console.error(`MongoDB connection failed: ${explain(err)}`);
    if (mongoose.connection.readyState !== 1) {
      setTimeout(connectDB, RETRY_MS);
    }
    return false;
  }
};

export default connectDB;
