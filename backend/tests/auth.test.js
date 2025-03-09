import request from "supertest";
import jest from "jest-mock";
import bcrypt from "bcrypt";

import app from "../src/app.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import transporter from "../src/services/mail/mailer.js";
import { ErrorMsg, SuccessMsg } from "../src/services/responseMessages.js";

describe("User registration", () => {
  let db;

  beforeAll(async () => {
    db = await connectDB();
    // Mock sendMail to prevent actual email sending.
    transporter.sendMail = jest.fn((mailData, callback) => {
      callback(null, { response: "Test mode: Email not sent" });
    });
    await db.collection("users").deleteMany({}); // Clear users table
  });

  afterAll(async () => {
    // Restore original implementation after tests.
    transporter.sendMail.mockRestore();
    await db.collection("users").deleteMany({}); // Clear users table
    await closeDB();
  });

  test("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test.email@gmail.com",
      password: "password123",
    });

    expect(res.body).toHaveProperty("message", SuccessMsg.REGISTRATION_OK);
    expect(res.statusCode).toBe(201);
    expect(transporter.sendMail).toHaveBeenCalled();
  });

  test("should not register a user with existing username", async () => {
    await request(app).post("/auth/register").send({
      username: "existingUser",
      email: "test1.email@gmail.com",
      password: "securepassword1",
    });

    const res = await request(app).post("/auth/register").send({
      username: "existingUser",
      email: "test2.email@gmail.com",
      password: "securepassword2",
    });

    expect(res.body.error).toBe(ErrorMsg.USERNAME_TAKEN);
    expect(res.statusCode).toBe(409);
  });

  test("should not register a user with existing email", async () => {
    await request(app).post("/auth/register").send({
      username: "newUser",
      email: "test@gmail.com",
      password: "securepassword1",
    });

    const res = await request(app).post("/auth/register").send({
      username: "newUser2",
      email: "test@gmail.com",
      password: "securepassword2",
    });

    expect(res.body.error).toBe(ErrorMsg.EMAIL_TAKEN);
    expect(res.statusCode).toBe(409);
  });

  test("should not register a user with missing fields", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "whereDidMyPasswordGo",
      email: "test2.email@gmail.com",
    });

    expect(res.body.error).toBe(ErrorMsg.NEEDS_PASSWORD);
    expect(res.statusCode).toBe(400);
  });
});

describe("User login", () => {
  let db;
  let testUsers;
  const staticSalt = "$2b$12$abcdefghijklmnopqrstuv";

  beforeAll(async () => {
    db = await connectDB();
    testUsers = [
      {
        username: "ExistingUser",
        email: "test.email@gmail.com",
        password: await bcrypt.hash("existing1", staticSalt),
        mfa: {
          enabled: false,
          secret: "",
        },
        is_verified: true,
        is_admin: false,
      },
      {
        username: "UnverifiedUser",
        email: "unverified.email@gmail.com",
        password: await bcrypt.hash("unverified1", staticSalt),
        mfa: {
          enabled: false,
          secret: "",
        },
        is_verified: false,
        is_admin: false,
      },
      {
        username: "VerifiedUser",
        email: "verified.email@gmail.com",
        password: await bcrypt.hash("verified1", staticSalt),
        mfa: {
          enabled: false,
          secret: "",
        },
        is_verified: true,
        is_admin: false,
      },
      {
        username: "unverifiedUser",
        email: "unverified.email@gmail.com",
        password: await bcrypt.hash("unverifiedPassword", staticSalt),
        mfa: {
          enabled: false,
          secret: "",
        },
        is_verified: false,
        is_admin: false,
      },
    ];

    // Delete all users from table and then insert test users
    await db.collection("users").deleteMany({});
    await db.collection("users").insertMany(testUsers);
  });

  afterAll(async () => {
    // Delete all users from table
    await db.collection("users").deleteMany({});
    await closeDB();
  });

  test("should log in a user who is verified and exists", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "VerifiedUser",
      password: "verified1",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should not log in a user who is unverified", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "UnverifiedUser",
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
      username: "VerifiedUser",
      password: "wrongPassword",
    });

    expect(res.body.error).toBe(ErrorMsg.WRONG_PASSWORD);
    expect(res.statusCode).toBe(401);
  });
});
