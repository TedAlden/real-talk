import request from "supertest";
import app from "../src/app.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import { createTestUsers } from "./testUtils.js";
import { jest, test } from "@jest/globals";
import * as followersController from "../src/controllers/followers.js";
import { ErrorMsg } from "../src/services/responseMessages.js";
describe("Follower functionality", () => {
  let db;
  let testIds;
  let testUsers;
  let mockRes;

  const testCities = [
    { address: { city: "London" } },
    { address: { city: "New York" } },
    { address: { city: "London" } },
    { address: { city: "London" } },
    { address: { city: "Tokyo" } },
    { address: { city: "London" } },
  ];

  beforeAll(async () => {
    db = await connectDB();
    // Insert test users
  });

  beforeEach(async () => {
    await db.collection("followers").deleteMany({});
    await db.collection("users").deleteMany({});
    await db.collection("posts").deleteMany({});
    const createdUsers = await createTestUsers(db, 6, testCities);
    testUsers = createdUsers.users;
    testIds = createdUsers.insertedIds;
  });

  afterAll(async () => {
    await db.collection("users").deleteMany({});
    await db.collection("followers").deleteMany({});
    await closeDB();
  });

  beforeEach(async () => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    await db.collection("followers").deleteMany({});
  });

  describe("createFollow", () => {
    test("should create a new follow relationship", async () => {
      const mockRequest = {
        body: {
          follower_id: testIds[0],
          followed_id: testIds[1],
        },
      };

      await followersController.createFollow(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          acknowledged: true,
          insertedId: expect.anything(),
        })
      );
    });

    test("should not create a follow if both followed and follower are same id", async () => {
      const mockRequest = {
        body: {
          follower_id: testIds[0],
          followed_id: testIds[0],
        },
      };

      await followersController.createFollow(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: ErrorMsg.FOLLOW_SELF_ERROR,
      });
    });

    test("should not create a follow if it already exists", async () => {
      await db.collection("followers").insertOne({
        follower_id: testIds[0],
        followed_id: testIds[1],
      });
      const mockRequest = {
        body: {
          follower_id: testIds[0],
          followed_id: testIds[1],
        },
      };

      await followersController.createFollow(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: ErrorMsg.ALREADY_FOLLOWING,
      });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockRequest = {
        body: {
          follower_id: testIds[0],
          followed_id: testIds[1],
        },
      };

      await followersController.createFollow(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("getFollowersById", () => {
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

      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: {},
      };

      await followersController.getFollowersById(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Object), expect.any(Object)])
      );
    });

    test("should correctly mark which followers of the user the viewer is following", async () => {
      /* 
       userToFollow : testIds[0]
       viewer : testIds[3]
       followers: testIds[1], testIds[2]
      */
      await db.collection("followers").insertMany([
        {
          follower_id: testIds[1],
          followed_id: testIds[0],
        },
        {
          follower_id: testIds[2],
          followed_id: testIds[0],
        },
        {
          follower_id: testIds[3],
          followed_id: testIds[1],
        },
      ]);
      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: { viewer_id: testIds[3] },
      };

      await followersController.getFollowersById(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            _id: testIds[1],
            isFollowing: true,
          }),
          expect.objectContaining({
            _id: testIds[2],
            isFollowing: false,
          }),
        ])
      );
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });
      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: {},
      };

      await followersController.getFollowersById(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("getFollowedUsersById", () => {
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

      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: {},
      };

      await followersController.getFollowedUsersById(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Object), expect.any(Object)])
      );
    });

    test("should correctly mark which followeds of the user the viewer is following", async () => {
      /* 
       userWhoFollows : testIds[0]
       viewer : testIds[3]
       followeds: testIds[1], testIds[2]
      */
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
          follower_id: testIds[3],
          followed_id: testIds[1],
        },
      ]);
      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: { viewer_id: testIds[3] },
      };

      await followersController.getFollowedUsersById(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            _id: testIds[1],
            isFollowing: true,
          }),
          expect.objectContaining({
            _id: testIds[2],
            isFollowing: false,
          }),
        ])
      );
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: { viewer_id: testIds[3] },
      };

      await followersController.getFollowedUsersById(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("unfollowUser", () => {
    test("should remove a follow relationship", async () => {
      // Create follow first
      await db.collection("followers").insertOne({
        follower_id: testIds[0],
        followed_id: testIds[1],
      });

      const mockRequest = {
        params: {
          follower_id: testIds[0],
          followed_id: testIds[1],
        },
      };

      await followersController.unfollowUser(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          acknowledged: true,
          deletedCount: 1,
        })
      );
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockRequest = {
        params: {
          follower_id: testIds[0],
          followed_id: testIds[1],
        },
      };

      await followersController.unfollowUser(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("getUserFollowStats", () => {
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

      const mockRequest = {
        params: {
          id: testIds[0],
        },
      };

      await followersController.getUserFollowStats(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        followedByUser: 2,
        followingUser: 3,
      });
    });

    test("should return 0 when user has no followers", async () => {
      const mockRequest = {
        params: {
          id: testIds[0],
        },
      };

      await followersController.getUserFollowStats(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        followedByUser: 0,
        followingUser: 0,
      });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockRequest = {
        params: {
          id: testIds[0],
        },
      };

      await followersController.getUserFollowStats(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("isUserFollowing", () => {
    test("should return true when a user is following another user", async () => {
      // Create follow relationship first
      await db.collection("followers").insertOne({
        follower_id: testIds[0],
        followed_id: testIds[1],
      });

      const mockRequest = {
        params: {
          follower_id: testIds[0],
          followed_id: testIds[1],
        },
      };

      await followersController.isUserFollowing(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(true);
    });

    test("should return false when a user is not following another user", async () => {
      const mockRequest = {
        params: {
          follower_id: testIds[0],
          followed_id: testIds[2],
        },
      };

      await followersController.isUserFollowing(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(false);
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockRequest = {
        params: {
          follower_id: testIds[0],
          followed_id: testIds[2],
        },
      };

      await followersController.isUserFollowing(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("getSuggestedFollows", () => {
    test("should return error when id is invalid oid", async () => {
      const mockRequest = {
        params: {
          id: "invalid_id",
        },
        query: {
          method: "mutuals",
        },
      };

      await followersController.getSuggestedFollows(mockRequest, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error:
          "input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
      });
    });

    test("should return error when no user matches provided id", async () => {
      const mockRequest = {
        params: {
          id: "67db47aaaaaaaa4e3b02d37f",
        },
        query: {
          method: "mutuals",
        },
      };

      await followersController.getSuggestedFollows(mockRequest, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: ErrorMsg.NO_SUCH_ID,
      });
    });

    test("should return error when method is invalid", async () => {
      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: {
          method: "invalid",
        },
      };

      await followersController.getSuggestedFollows(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid method" });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: {
          method: "mutuals",
        },
      };

      await followersController.getSuggestedFollows(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });

    test("should return suggested follows based on mutuals", async () => {
      await db.collection("followers").insertMany([
        // 0 the target, follows 4 and 5
        {
          follower_id: testIds[0],
          followed_id: testIds[4],
        },
        {
          follower_id: testIds[0],
          followed_id: testIds[5],
        },
        // 1 follows both 4 and 5, 2 mutuals
        {
          follower_id: testIds[1],
          followed_id: testIds[4],
        },
        // 1 follows both 4 and 5, 2 mutuals
        {
          follower_id: testIds[1],
          followed_id: testIds[5],
        },
        // 2 follows 4 only, 1 mutual
        {
          follower_id: testIds[2],
          followed_id: testIds[4],
        },
        // 3 follows both 4 and 5, 2 mutuals
        {
          follower_id: testIds[3],
          followed_id: testIds[4],
        },
        {
          follower_id: testIds[3],
          followed_id: testIds[5],
        },
        // 0 alraedy follow 3
        {
          follower_id: testIds[0],
          followed_id: testIds[3],
        },
      ]);

      const expectedResponse = [
        {
          ...testUsers[1],
          mutualCount: 2,
        },
        {
          ...testUsers[2],
          mutualCount: 1,
        },
      ];

      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: {
          method: "mutuals",
        },
      };

      await followersController.getSuggestedFollows(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("should return suggested follows based on area", async () => {
      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: {
          method: "area",
        },
      };

      await db.collection("followers").insertOne(
        // 0 already follows 3
        {
          follower_id: testIds[0],
          followed_id: testIds[3],
        }
      );

      await followersController.getSuggestedFollows(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([testUsers[2], testUsers[5]])
      );
      expect(mockRes.json.mock.calls[0][0].length).toBe(2);
    });

    test("should return suggested follows based on interests", async () => {
      //0 likes sports 2x, art 1x
      await db.collection("posts").insertMany([
        { likes: [testIds[0], testIds[1], testIds[4]], tags: ["art"] },
        { likes: [testIds[0], testIds[1]], tags: ["art"] },
        { likes: [testIds[0]], tags: ["art", "gaming"] },
        { likes: [testIds[1], testIds[4]], tags: ["art"] },
        { likes: [testIds[2]], tags: ["gaming", "sports"] },
        { likes: [testIds[2]], tags: ["gaming", "travel"] },
        { likes: [testIds[1], testIds[2], testIds[3]], tags: ["travel"] },
        { likes: [testIds[2], testIds[3]], tags: ["sports"] },
      ]);
      await db.collection("followers").insertOne(
        // 0 already follows 4
        {
          follower_id: testIds[0],
          followed_id: testIds[4],
        }
      );

      const expectedResponse = [
        {
          ...testUsers[1],
          interestScore: 9,
        },
        {
          ...testUsers[2],
          interestScore: 2,
        },
      ];

      const mockRequest = {
        params: {
          id: testIds[0],
        },
        query: {
          method: "interests",
        },
      };

      await followersController.getSuggestedFollows(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
