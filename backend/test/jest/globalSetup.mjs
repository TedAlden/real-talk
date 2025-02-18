import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

async function globalSetup() {
  const database_name = "test";
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  process.env.MONGO_TEST_URI = uri.slice(0, uri.lastIndexOf("/"));
  global.__MONGOINSTANCE = instance;
  const client = new MongoClient(process.env.MONGO_URI + "/" + database_name);

  await client.connect();
  await client.db().dropDatabase();
  await client.close();
}

export default globalSetup;
