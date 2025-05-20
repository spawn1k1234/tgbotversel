import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not defined");

const options = {
  serverSelectionTimeoutMS: 10000,
  // TLS включен по умолчанию, дополнительная настройка не нужна
};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
