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
    // Get the database name
    const dbName = db.databaseName;

    // Log the worker ID and database name for verification
    console.log(
      `Worker ID: ${process.env.JEST_WORKER_ID}, Database: ${dbName}`
    );

    // Verify database name contains worker ID when running in parallel
    if (process.env.JEST_WORKER_ID) {
      expect(dbName).toContain(process.env.JEST_WORKER_ID);
    }
  });
});
