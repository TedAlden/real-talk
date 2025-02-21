import request from "supertest";
import jest from "jest-mock";
import bcrypt from "bcrypt";

import app from "../src/app.js";
import { connectDB, closeDB } from "../src/db/connection.js";
import transporter from "../src/util/mailer.js";

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

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully.");
    expect(transporter.sendMail).toHaveBeenCalled();
  });

  test("should not register a user with existing username", async () => {
    await db.collection("users").insertOne({
      username: "existingUser",
      email: "test.email@gmail.com",
      password: "hashedpwd",
    });

    const res = await request(app).post("/auth/register").send({
      username: "existingUser",
      email: "test.email@gmail.com",
      password: "securepassword",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe("Username is already registered.");
  });

  test("should not register a user with missing fields", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "whereDidMyPasswordGo",
      email: "test2.email@gmail.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Username, email or password is missing.");
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
        isVerified: true,
      },
      {
        username: "UnverifiedUser",
        email: "unverified.email@gmail.com",
        password: await bcrypt.hash("unverified1", staticSalt),
        isVerified: false,
      },
      {
        username: "VerifiedUser",
        email: "verified.email@gmail.com",
        password: await bcrypt.hash("verified1", staticSalt),
        isVerified: true,
      },
      {
        username: "unverifiedUser",
        email: "unverified.email@gmail.com",
        password: await bcrypt.hash("unverifiedPassword", staticSalt),
        isVerified: false,
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

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("User is not verified");
  });

  test("should not log in a user who doesnt exist", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "SantaClaus",
      password: "password3",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User doesn't exist");
  });

  test("should not log in a user with a wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "VerifiedUser",
      password: "wrongPassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Incorrect password");
  });
});
