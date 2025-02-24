import { MongoClient } from "mongodb";

let connString = process.env.DATABASE_URI || "";
let databaseName = process.env.DATABASE_NAME || "";
let client;
let db;

if (process.env.MONGO_URL) {
  connString = process.env.MONGO_URL;
  databaseName = "jest";
}

export async function connectDB() {
  if (!client) {
    client = new MongoClient(connString);
    await client.connect();
    db = client.db(databaseName);
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close(true); // Force close all connections
    client = null;
    db = null;
  }
}

export default { connectDB, closeDB };
