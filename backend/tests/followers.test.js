import request from "supertest";
import app from "../src/app.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import { createTestUsers } from "./testUtils.js";

describe("Follower functionality", () => {
  let db;
  let testIds;

  beforeAll(async () => {
    db = await connectDB();
    // Insert test users
    const createdUsers = await createTestUsers(db, 5);
    testIds = createdUsers.insertedIds;
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
        follower_id: testIds[0],
        followed_id: testIds[1],
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("acknowledged", true);
      expect(res.body).toHaveProperty("insertedId");
    });
  });

  describe("GET /api/users/:id/followers", () => {
    test("should get all followers of a user", async () => {
      await db.collection("followers").insertMany([
        {
          follower_id: testIds[1],
          followed_id: testIds[0],
        },
        {
          follower_id: testIds[2],
          followed_id: testIds[0],
        },
      ]);

      const res = await request(app).get(`/api/users/${testIds[0]}/followers`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("GET /api/users/:id/followed", () => {
    test("should get all users followed by a user", async () => {
      await db.collection("followers").insertMany([
        {
          follower_id: testIds[0],
          followed_id: testIds[1],
        },
        {
          follower_id: testIds[0],
          followed_id: testIds[2],
        },
      ]);

      const res = await request(app).get(`/api/users/${testIds[0]}/followed`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("DELETE /api/users/:follower_id/unfollow/:followed_id", () => {
    test("should remove a follow relationship", async () => {
      // Create follow first
      await db.collection("followers").insertOne({
        follower_id: testIds[0],
        followed_id: testIds[1],
      });

      const res = await request(app).delete(
        `/api/users/${testIds[0]}/unfollow/${testIds[1]}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("acknowledged", true);
      expect(res.body).toHaveProperty("deletedCount", 1);
    });
  });

  describe("GET /api/users/:id/follow_stats", () => {
    test("should get the count of followers and followed for a user", async () => {
      await db.collection("followers").insertMany([
        {
          follower_id: testIds[0],
          followed_id: testIds[1],
        },
        {
          follower_id: testIds[0],
          followed_id: testIds[2],
        },
        {
          follower_id: testIds[1],
          followed_id: testIds[0],
        },
        {
          follower_id: testIds[3],
          followed_id: testIds[0],
        },
        {
          follower_id: testIds[4],
          followed_id: testIds[0],
        },
      ]);

      const res = await request(app).get(
        `/api/users/${testIds[0]}/follow_stats`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("followedByUser", 2);
      expect(res.body).toHaveProperty("followingUser", 3);
    });

    test("should return 0 when user has no followers", async () => {
      const res = await request(app).get(
        `/api/users/${testIds[0]}/follow_stats`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("followedByUser", 0);
      expect(res.body).toHaveProperty("followingUser", 0);
    });
  });
});
