import request from "supertest";
import app from "../src/app.js";
import { connectDB, closeDB } from "../src/database/connection.js";

describe("Follower functionality", () => {
  let db;
  let testUsers;

  beforeAll(async () => {
    db = await connectDB();
    // Insert test users
    testUsers = await db.collection("users").insertMany([
      {
        username: "follower1",
        email: "follower1@test.com",
      },
      {
        username: "follower2",
        email: "follower2@test.com",
      },
      {
        username: "followed1",
        email: "followed1@test.com",
      },
    ]);
  });

  afterAll(async () => {
    await db.collection("users").deleteMany({});
    await db.collection("followers").deleteMany({});
    await closeDB();
  });

  afterEach(async () => {
    await db.collection("followers").deleteMany({});
  });

  describe("POST /api/users/follows", () => {
    test("should create a new follow relationship", async () => {
      const res = await request(app).post(`/api/users/follows`).send({
        follower_id: testUsers.insertedIds[0],
        followed_id: testUsers.insertedIds[2],
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("acknowledged", true);
      expect(res.body).toHaveProperty("insertedId");
    });
  });

  // describe("GET /api/users/:id/followers", () => {
  //   test("should get all followers of a user", async () => {
  //     // Create some follows first
  //     await db.collection("followers").insertMany([
  //       {
  //         follower_id: testUsers.insertedIds[0],
  //         followed_id: testUsers.insertedIds[2],
  //       },
  //       {
  //         follower_id: testUsers.insertedIds[1],
  //         followed_id: testUsers.insertedIds[2],
  //       },
  //     ]);

  //     console.debug(testUsers.insertedIds[2]);

  //     const res = await request(app).get(
  //       `/api/users/${testUsers.insertedIds[2]}/followers?viewer_id=${testUsers.insertedIds[2]}`
  //     );
  //     console.log("Response status:", res.status);
  //     console.log("Response body:", res.body);
  //     expect(res.status).toBe(200);
  //     expect(Array.isArray(res.body)).toBe(true);
  //     expect(res.body).toHaveLength(2);
  //   });
  // });

  // describe("GET /api/users/:id/followed", () => {
  //   test("should get all users followed by a user", async () => {
  //     // Create follows first
  //     await db.collection("followers").insertMany([
  //       {
  //         follower_id: testUsers.insertedIds[0],
  //         followed_id: testUsers.insertedIds[1],
  //       },
  //       {
  //         follower_id: testUsers.insertedIds[0],
  //         followed_id: testUsers.insertedIds[2],
  //       },
  //     ]);

  //     const res = await request(app).get(
  //       `/api/users/${testUsers.insertedIds[0]}/followed?viewer_id=${testUsers.insertedIds[0]}`
  //     );

  //     console.log("Response status:", res.status);
  //     console.log("Response body:", res.body);

  //     expect(res.status).toBe(200);
  //     expect(Array.isArray(res.body)).toBe(true);
  //     expect(res.body).toHaveLength(2);
  //   });
  // });

  describe("DELETE /api/users/:follower_id/unfollow/:followed_id", () => {
    test("should remove a follow relationship", async () => {
      // Create follow first
      await db.collection("followers").insertOne({
        follower_id: testUsers.insertedIds[0],
        followed_id: testUsers.insertedIds[2],
      });

      const res = await request(app).delete(
        `/api/users/${testUsers.insertedIds[0]}/unfollow/${testUsers.insertedIds[2]}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("acknowledged", true);
      expect(res.body).toHaveProperty("deletedCount", 1);
    });
  });
});
