import { connectDB, closeDB } from "../src/database/connection.js";

describe("Test database connection", () => {
  let db;
  beforeAll(async () => {
    db = await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  test("Each worker should have a unique database name", async () => {
    const dbName = db.databaseName;

    if (process.env.JEST_WORKER_ID) {
      expect(dbName).toContain(process.env.JEST_WORKER_ID);
    }
  });
});
