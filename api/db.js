const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // Например: mongodb+srv://user:pass@cluster.mongodb.net/dbname
if (!uri) throw new Error("MONGODB_URI must be provided in env");

let client;
let db;

async function connect() {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db("telegram_bot"); // имя базы
  return db;
}

async function getChatIdsCollection() {
  const database = await connect();
  return database.collection("chat_ids");
}

module.exports = { getChatIdsCollection };
