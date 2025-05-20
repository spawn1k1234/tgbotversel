const { MongoClient } = require("mongodb");

let client = null;

async function connectToDatabase() {
  if (client && client.topology && client.topology.isConnected()) {
    return client.db();
  }

  const options = {
    tls: true,
    tlsAllowInvalidCertificates: false,
    retryWrites: true,
    retryReads: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 5000,
    sslValidate: true,
    directConnection: false,
    monitorCommands: true, // Для отладки
  };

  client = new MongoClient(process.env.MONGODB_URI, options);

  try {
    await client.connect();
    console.log("Successfully connected to MongoDB");
    return client.db();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

// Добавьте обработчик закрытия подключения
process.on("SIGINT", async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
});

module.exports = { connectToDatabase };
