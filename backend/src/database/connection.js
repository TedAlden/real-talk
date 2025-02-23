import { MongoClient } from "mongodb";

let databaseURI = process.env.DATABASE_URI || "";
let databaseName = process.env.DATABASE_NAME || "";

let client;
let db;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(databaseURI);
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
