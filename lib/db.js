// lib/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please add MONGODB_URI to .env");
}

// Опции подключения — убираем deprecated sslValidate, добавляем tls=true
const options = {
  // Таймаут выбора сервера (опционально)
  serverSelectionTimeoutMS: 10000,

  // Включаем TLS, не используем deprecated sslValidate
  tls: true,

  // Если есть проблемы с сертификатами (не рекомендую на проде), можно временно
  // tlsAllowInvalidCertificates: true,
};

let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
