import { MongoClient } from "mongodb";

let connString = process.env.DATABASE_URI || "";

let databaseName = process.env.DATABASE_NAME || "";
let client;
let db;

if (process.env.NODE_ENV === "test") {
  if (!global.__MONGO_URI__) {
    throw new Error("In-memory test database unable to be initialized");
  }
  connString = global.__MONGO_URI__;
  databaseName = `test_db${process.env.JEST_WORKER_ID}`;
}

export async function connectDB() {
  try {
    if (!client) {
      client = new MongoClient(connString, { autoSelectFamily: false });
      await client.connect();
      db = client.db(databaseName);
    }
    return db;
  } catch (err) {
    console.log("Error connecting to database: ", err);
  }
}

export async function closeDB() {
  if (client) {
    await client.close(true); // Force close all connections
    client = null;
    db = null;
  }
}

export default { connectDB, closeDB };
