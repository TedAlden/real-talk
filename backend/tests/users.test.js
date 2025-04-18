import { ObjectId } from "mongodb";
import { jest } from "@jest/globals";
import * as usersController from "../src/controllers/users.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import { createTestUsers } from "./testUtils.js";
import { ErrorMsg, SuccessMsg } from "../src/services/responseMessages.js";
import { param } from "express-validator";
import bcrypt from "bcrypt";

describe("Users Controller", () => {
  let db;
  let mockRes;
  let testUsers;
  let testIds;

  beforeAll(async () => {
    db = await connectDB();

    const createdUsers = await createTestUsers(db, 8, [
      { username: "myIdIsSpecial" },
      { username: "filterMyUsername" },
      { email: "filter.my@email.com" },
      { username: "filterTwo", email: "filter@Two.com" },
      { username: "changeMyUsername", email: "changeMyEmail" },
      { email: "existing@email.com" },
      { username: "takenUsername" },
      { username: "deleteMe" },
    ]);
    ({ insertedIds: testIds, users: testUsers } = createdUsers);
  });

  afterAll(async () => {
    await db.collection("users").deleteMany({});
    await closeDB();
  });

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getUsersByQuery", () => {
    test("should retrieve all users when no query parameters are provided", async () => {
      const mockReq = { query: {} };

      await usersController.getUsersByQuery(mockReq, mockRes);

      const testUsersNoPasswords = testUsers.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(testUsersNoPasswords);
    });

    test("should filter users by username", async () => {
      const mockReq = { query: { username: "filterMyUsername" } };

      await usersController.getUsersByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ username: "filterMyUsername" }),
        ])
      );
      expect(mockRes.json.mock.calls[0][0].length).toBe(1);
      expect(mockRes.json.mock.calls[0][0][0].username).toBe(
        "filterMyUsername"
      );
    });

    test("should filter users by email", async () => {
      const mockReq = { query: { email: "filter.my@email.com" } };

      await usersController.getUsersByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ email: "filter.my@email.com" }),
        ])
      );
      expect(mockRes.json.mock.calls[0][0].length).toBe(1);
      expect(mockRes.json.mock.calls[0][0][0].email).toBe(
        "filter.my@email.com"
      );
    });

    test("should filter users by ID", async () => {
      const mockReq = { query: { id: testIds[0].toString() } };

      await usersController.getUsersByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ _id: testIds[0] })])
      );
      expect(mockRes.json.mock.calls[0][0].length).toBe(1);
      expect(mockRes.json.mock.calls[0][0][0]._id.toString()).toBe(
        testIds[0].toString()
      );
    });

    test("should filter users by multiple criteria", async () => {
      const mockReq = {
        query: {
          username: "filterTwo",
          email: "filter@Two.com",
        },
      };

      await usersController.getUsersByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: "filterTwo",
            email: "filter@Two.com",
          }),
        ])
      );
      expect(mockRes.json.mock.calls[0][0].length).toBe(1);
    });

    test("should return an empty array when no users match criteria", async () => {
      const mockReq = { query: { username: "nonexistentuser" } };

      await usersController.getUsersByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = { query: { username: "filterMyUsername" } };

      await usersController.getUsersByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("getUserById", () => {
    test("should retrieve a user with the provided id", async () => {
      const mockReq = { params: { id: testIds[0] } };

      await usersController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: testIds[0],
          username: "myIdIsSpecial",
        })
      );

      // Verify password is not included in response
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.password).toBeUndefined();
    });

    test("should return an empty array when no users match criteria", async () => {
      const mockReq = { query: { username: "nonexistentuser" } };

      await usersController.getUsersByQuery(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    test("should return error response when no user with the provided id exists", async () => {
      const mockReq = { params: { id: "123456789abcda92f90c283f" } };

      await usersController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: ErrorMsg.NO_SUCH_ID });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = { params: { id: testIds[0] } };

      await usersController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("updateUserById", () => {
    test("should update user details successfully", async () => {
      const mockReq = {
        params: { id: testIds[4] },
        body: {
          username: "updatedUsername",
        },
      };

      await usersController.updateUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: SuccessMsg.USER_UPDATE_OK,
      });
    });

    test("should return error when user ID doesn't exist", async () => {
      const nonExistentId = new ObjectId();
      const mockReq = {
        params: { id: nonExistentId },
        body: { username: "updatedUsername" },
      };

      await usersController.updateUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: ErrorMsg.NO_SUCH_ID });
    });

    test("should return error when email is already taken", async () => {
      const mockReq = {
        params: { id: testIds[4] },
        body: { email: "existing@email.com" },
      };

      await usersController.updateUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: ErrorMsg.EMAIL_TAKEN,
      });

      // Clean up
      await db.collection("users").deleteMany({
        username: { $in: ["existingUser", "userToUpdate"] },
      });
    });

    test("should return error when username is already taken", async () => {
      const mockReq = {
        params: { id: testIds[4] },
        body: { username: "takenUsername" },
      };

      await usersController.updateUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: ErrorMsg.USERNAME_TAKEN,
      });

      // Clean up
      await db.collection("users").deleteMany({
        username: { $in: ["takenUsername", "uniqueUsername"] },
      });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = {
        params: { id: testIds[0] },
        body: { username: "newName" },
      };

      await usersController.updateUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });

  describe("deleteUserById", () => {
    test("should delete a user with the provided id", async () => {
      // Create a temporary user to delete
      const tempUser = {
        username: "tempDeleteUser",
        email: "temp@delete.com",
        password: "password123",
      };
      const result = await db.collection("users").insertOne(tempUser);
      const tempUserId = result.insertedId;

      const mockReq = { params: { id: tempUserId } };

      await usersController.deleteUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: SuccessMsg.USER_DELETE_OK,
      });

      // Verify user was actually deleted
      const deletedUser = await db
        .collection("users")
        .findOne({ _id: tempUserId });
      expect(deletedUser).toBeNull();
    });

    test("should return error response when no user with the provided id exists", async () => {
      const nonExistentId = new ObjectId();
      const mockReq = { params: { id: nonExistentId } };

      await usersController.deleteUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: ErrorMsg.NO_SUCH_ID });
    });

    test("should return error response when database error occurs", async () => {
      const collectionSpy = jest
        .spyOn(db, "collection")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected database error");
        });

      const mockReq = { params: { id: testIds[0] } };

      await usersController.deleteUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected database error",
      });
    });
  });
});
