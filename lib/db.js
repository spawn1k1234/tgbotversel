import { MongoClient } from "mongodb";

async function test() {
  const uri = "твой MONGODB_URI сюда";
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    tls: true,
    // tlsAllowInvalidCertificates: true, // если хочешь попробовать
  });
  try {
    await client.connect();
    console.log("MongoDB connected");
    await client.db("telegram_bot").command({ ping: 1 });
    console.log("Pinged your deployment successfully.");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

test();
