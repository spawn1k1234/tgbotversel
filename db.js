// db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

let db;

async function connectDB() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db();
  console.log("✅ Подключено к MongoDB");
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
