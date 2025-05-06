import request from "supertest";
import jest from "jest-mock";
import { createTestUsers } from "./testUtils.js";
import app from "../src/app.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import transporter from "../src/services/mail/mailer.js";
import { ErrorMsg, SuccessMsg } from "../src/services/responseMessages.js";

describe("User Authentication", () => {
  let db;
  let testUsers;

  beforeAll(async () => {
    db = await connectDB();
    // Mock sendMail to prevent actual email sending
    transporter.sendMail = jest.fn((mailData, callback) => {
      callback(null, { response: "Test mode: Email not sent" });
    });
    // Clear users collection and create a set of test users for all tests
    await db.collection("users").deleteMany({});
    const createdUsers = await createTestUsers(db, 4, [
      { username: "myUsername" },
      { email: "used.your.email@test.com" },
      { is_verified: true },
      { is_verified: false },
    ]);
    testUsers = {
      sameUsernameUser: createdUsers.users[0],
      sameEmailUser: createdUsers.users[1],
      verifiedUser: createdUsers.users[2],
      unverifiedUser: createdUsers.users[3],
    };
  });

  afterAll(async () => {
    // Restore original mailer implementation
    transporter.sendMail.mockRestore();
    // Clean up test data
    await db.collection("users").deleteMany({});
    await closeDB();
  });

  describe("POST /auth/register", () => {
    test("should register a new user", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: "newtestuser",
          email: "new.test.email@gmail.com",
          password: "newPassword@123",
          date_of_birth: new Date("2000-01-01"),
        });

      expect(res.body).toHaveProperty("message", SuccessMsg.REGISTRATION_OK);
      expect(res.statusCode).toBe(201);
      expect(transporter.sendMail).toHaveBeenCalled();
    });

    test("should not register a user with existing username", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: testUsers.sameUsernameUser.username,
          email: "new.email@gmail.com",
          password: "newPassword@2",
          date_of_birth: new Date("2000-01-01"),
        });

      expect(res.body.error).toBe(ErrorMsg.USERNAME_TAKEN);
      expect(res.statusCode).toBe(409);
    });

    test("should not register a user with existing email", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: "newUser2",
          email: testUsers.sameEmailUser.email,
          password: "Securepassword@2",
          date_of_birth: new Date("2000-01-01"),
        });

      expect(res.body.error).toBe(ErrorMsg.EMAIL_TAKEN);
      expect(res.statusCode).toBe(409);
    });

    test("should not register a user with missing fields", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: "whereDidMyPasswordGo",
          email: "test2.email@gmail.com",
          date_of_birth: new Date("2000-01-01"),
        });

      expect(res.body.error).toBe(ErrorMsg.NEEDS_PASSWORD);
      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /auth/login", () => {
    test("should log in a user who is verified and exists", async () => {
      const res = await request(app).post("/auth/login").send({
        username: testUsers.verifiedUser.username,
        password: "password3",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    test("should not log in a user who is unverified", async () => {
      const res = await request(app).post("/auth/login").send({
        username: testUsers.unverifiedUser.username,
        password: "password2",
      });

      expect(res.body.error).toBe(ErrorMsg.UNVERIFIED_USER);
      expect(res.statusCode).toBe(401);
    });

    test("should not log in a user who doesnt exist", async () => {
      const res = await request(app).post("/auth/login").send({
        username: "SantaClaus",
        password: "password3",
      });

      expect(res.body.error).toBe(ErrorMsg.NO_SUCH_USERNAME);
      expect(res.statusCode).toBe(400);
    });

    test("should not log in a user with a wrong password", async () => {
      const res = await request(app).post("/auth/login").send({
        username: testUsers.verifiedUser.username,
        password: "wrongPassword",
      });

      expect(res.body.error).toBe(ErrorMsg.WRONG_PASSWORD);
      expect(res.statusCode).toBe(401);
    });
  });
});
