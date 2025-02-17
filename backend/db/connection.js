import { MongoClient } from "mongodb";

//These parameters are taken from the .env file, usually kept on your machine rather than the repo for security
const connectionString = process.env.DATABASE_URI || "";
const databaseName = process.env.DATABASE_NAME || "";

//Create a new MongoClient and connect to the database
const client = new MongoClient(connectionString);
let conn;
try {
  //Connect to the database
  conn = await client.connect();
} catch (e) {
  //If there was an error, log it
  console.error(e);
}

//Get the database from the connection and export it for other modules to use
let db = conn.db(databaseName);
export default db;
