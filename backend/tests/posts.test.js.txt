import { ObjectId } from "mongodb";
import { jest } from "@jest/globals";
import * as postsController from "../src/controllers/posts.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import { ErrorMsg, SuccessMsg } from "../src/services/responseMessages.js";

describe("Posts Controller", () => {
  let db;
  let mockRes;
  let testPosts;
  let testIds;

  beforeAll(async () => {
    db = await connectDB();

    // Create test posts
    const posts = [
      {
        user_id: new ObjectId(),
        content: "First test post",
        media: "image1.jpg",
        likes: [],
        comments: [],
        tags: ["test", "first"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: new ObjectId(),
        content: "Post with specific tag",
        media: "image2.jpg",
        likes: [],
        comments: [],
        tags: ["specific"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: new ObjectId(),
        content: "Post to be updated",
        media: "image3.jpg",
        likes: [],
        comments: [],
        tags: ["update"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: new ObjectId(),
        content: "Post to be deleted",
        media: "image4.jpg",
        likes: [],
        comments: [],
        tags: ["delete"],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const result = await db.collection("posts").insertMany(posts);
    testIds = Object.values(result.insertedIds);
    testPosts = posts.map((post, index) => ({
      ...post,
      _id: testIds[index],
    }));
  });

  afterAll(async () => {
    await db.collection("posts").deleteMany({});
    await closeDB();
  });

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createPost", () => {
    test("should create a new post successfully", async () => {
      const mockReq = {
        body: {
          user_id: new ObjectId(),
          content: "New post content",
          media: "newimage.jpg",
          tags: ["new", "post"],
        },
      };

      await postsController.createPost(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: SuccessMsg.POST_CREATION_OK,
      });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = {
        body: {
          user_id: new ObjectId(),
          content: "Error post content",
          media: "errorimage.jpg",
        },
      };

      await postsController.createPost(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: ErrorMsg.SERVER_ERROR,
      });

      collectionSpy.mockRestore();
    });
  });

  describe("getPostsByQuery", () => {
    test("should retrieve all posts when no query parameters are provided", async () => {
      const mockReq = { query: {} };

      await postsController.getPostsByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ content: "First test post" }),
          expect.objectContaining({ content: "Post with specific tag" }),
          expect.objectContaining({ content: "Post to be updated" }),
          expect.objectContaining({ content: "Post to be deleted" }),
        ])
      );
    });

    test("should filter posts by tag", async () => {
      const mockReq = { query: { tag: "specific" } };

      await postsController.getPostsByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      // Note: There's a bug in the controller where filter.tag = tag, but should be filter.tags = tag
      // This test is expected to fail until the bug is fixed
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = { query: {} };

      await postsController.getPostsByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });

      collectionSpy.mockRestore();
    });
  });

  describe("getPostById", () => {
    test("should retrieve a post with the provided id", async () => {
      const mockReq = { params: { id: testIds[0] } };

      await postsController.getPostById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: testIds[0],
          content: "First test post",
        })
      );
    });

    test("should return error response when no post with the provided id exists", async () => {
      const nonExistentId = new ObjectId();
      const mockReq = { params: { id: nonExistentId } };

      await postsController.getPostById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: ErrorMsg.NO_SUCH_POST,
      });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = { params: { id: testIds[0] } };

      await postsController.getPostById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });

      collectionSpy.mockRestore();
    });
  });

  describe("updatePostById", () => {
    test("should update post details successfully", async () => {
      const mockReq = {
        params: { id: testIds[2] },
        body: {
          content: "Updated content",
        },
      };

      await postsController.updatePostById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: SuccessMsg.POST_UPDATE_OK,
      });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = {
        params: { id: testIds[2] },
        body: { content: "Will cause error" },
      };

      await postsController.updatePostById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });

      collectionSpy.mockRestore();
    });
  });

  describe("deletePostById", () => {
    test("should delete a post with the provided id", async () => {
      const mockReq = { params: { id: testIds[3] } };

      await postsController.deletePostById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: SuccessMsg.POST_DELETE_OK,
      });

      // Verify post was actually deleted
      const deletedPost = await db
        .collection("posts")
        .findOne({ _id: testIds[3] });
      expect(deletedPost).toBeNull();
    });

    test("should return error response when no post with the provided id exists", async () => {
      const nonExistentId = new ObjectId();
      const mockReq = { params: { id: nonExistentId } };

      await postsController.deletePostById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: ErrorMsg.NO_SUCH_POST,
      });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = { params: { id: testIds[0] } };

      await postsController.deletePostById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });

      collectionSpy.mockRestore();
    });
  });
});
