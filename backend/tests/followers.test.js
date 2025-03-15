import request from "supertest";
import app from "../src/app.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import { createTestUsers } from "./testUtils.js";

describe("Follower functionality", () => {
  let db;
  let testUsers;

  beforeAll(async () => {
    db = await connectDB();
    // Insert test users
    const createdUsers = await createTestUsers(db, 7);
    testUsers = {
      celeb: createdUsers.users[0], // User with many followers
      normal: createdUsers.users[1], // User with normal activity
      followerA: createdUsers.users[2], // Follows many people
      followerB: createdUsers.users[3], // Follows only celebs
      unfollower: createdUsers.users[4], // User who will unfollow someone
    };
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
        follower_id: testUsers.followerA._id,
        followed_id: testUsers.celeb._id,
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
          follower_id: testUsers.followerA._id,
          followed_id: testUsers.celeb._id,
        },
        {
          follower_id: testUsers.followerB._id,
          followed_id: testUsers.celeb._id,
        },
      ]);

      const res = await request(app).get(
        `/api/users/${testUsers.celeb._id}/followers?viewer_id=${testUsers.celeb._id}`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("GET /api/users/:id/followed", () => {
    test("should get all users followed by a user", async () => {
      await db.collection("followers").insertMany([
        {
          follower_id: testUsers.followerA._id,
          followed_id: testUsers.celeb._id,
        },
        {
          follower_id: testUsers.followerA._id,
          followed_id: testUsers.normal._id,
        },
      ]);

      const res = await request(app).get(
        `/api/users/${testUsers.followerA._id}/followed?viewer_id=${testUsers.followerA._id}`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("DELETE /api/users/:follower_id/unfollow/:followed_id", () => {
    test("should remove a follow relationship", async () => {
      // Create follow first
      await db.collection("followers").insertOne({
        follower_id: testUsers.unfollower._id,
        followed_id: testUsers.celeb._id,
      });

      const res = await request(app).delete(
        `/api/users/${testUsers.unfollower._id}/unfollow/${testUsers.celeb._id}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("acknowledged", true);
      expect(res.body).toHaveProperty("deletedCount", 1);
    });
  });
});
