const { MongoClient } = require("mongodb");

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  cachedDb = db;
  return db;
}

async function saveUser(user) {
  const db = await connectToDatabase();
  const users = db.collection("users");

  await users.updateOne({ id: user.id }, { $set: user }, { upsert: true });
}

async function getAllUsers() {
  const db = await connectToDatabase();
  const users = db.collection("users");

  return await users.find({}).toArray();
}

module.exports = {
  connectToDatabase,
  saveUser,
  getAllUsers,
};
