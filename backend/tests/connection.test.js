import { connectDB, closeDB } from "../src/database/connection.js";

describe("Test database connection", () => {
  let db;
  beforeAll(async () => {
    db = await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  test("connected db should be an in-memory test database named jest", async () => {
    expect(db.databaseName).toBe("jest");
  });
});
