// lib/db.js
import { MongoClient } from "mongodb";

let client;
let clientPromise;

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 10000,
};

if (!uri) throw new Error("Please add MONGODB_URI to .env");

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;
