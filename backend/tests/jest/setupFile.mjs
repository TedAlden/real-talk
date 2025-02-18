import { MongoClient } from "mongodb";

let client;

beforeAll(async () => {
  client = new MongoClient(process.env.MONGO_TEST_URI);
  await client.connect();
});

afterAll(async () => {
  await client.close();
});
