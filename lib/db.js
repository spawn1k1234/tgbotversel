const { MongoClient } = require("mongodb");

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    retryWrites: true,
    retryReads: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    const db = client.db();
    cachedDb = db;
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
};
