import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  process.env.MONGO_TEST_DB = "TestDB";
  process.env.MONGO_TEST_URI = uri.slice(0, uri.lastIndexOf("/"));
  global.__MONGOINSTANCE = instance;
  const client = new MongoClient(
    process.env.MONGO_TEST_URI + "/" + process.env.MONGO_TEST_DB
  );

  await client.connect();
  await client.db().dropDatabase();
  await client.close();
}

export default globalSetup;
