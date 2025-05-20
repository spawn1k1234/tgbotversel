import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please add MONGODB_URI to .env");

const options = {
  serverSelectionTimeoutMS: 10000,
  tls: true,
  // Если нужно отключить проверку сертификата (не рекомендовано для продакшена), раскомментируйте:
  // tlsAllowInvalidCertificates: true,
};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
