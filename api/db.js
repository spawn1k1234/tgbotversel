// db.js
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://steam2akkdwa:nOTm73k7CT1g0S2n@cluster0.zbsztdc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client;
let db;

async function connect() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("telegram_bot"); // имя базы данных
  }
  return db;
}

module.exports = { connect };
