import { MongoClient } from "mongodb";

const connectionString = process.env.DATABASE_URI || "";
const databaseName = process.env.DATABASE_NAME || "";

const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}
let db = conn.db(databaseName);
export default db;
