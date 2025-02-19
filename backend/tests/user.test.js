import request from "supertest";
import app from "../src/app";
import db from "../src/db/connection";
import transporter from "../src/util/mailer.js"; // Import the mailer
import jest from "jest-mock";
import bcrypt from "bcrypt";

const userCollection = db.collection("users");

describe("User registration", () => {
  beforeAll(async () => {
    // Override sendMail to prevent actual email sending.
    transporter.sendMail = jest.fn((mailData, callback) => {
      callback(null, { response: "Test mode: Email not sent" });
    });
    await userCollection.deleteMany({});
  });

  afterAll(async () => {
    // Restore original implementation after tests.
    transporter.sendMail.mockRestore();
    await userCollection.deleteMany({});
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
    expect(res.body.error).toBe("That username is already taken");
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
  beforeAll(async () => {
    await userCollection.deleteMany({});
  });

  afterAll(async () => {
    await userCollection.deleteMany({});
  });

  test("should log in a user who is verified and exists", async () => {
    const hashedPassword = await bcrypt.hash("hashedpwd", 10);
    const { insertedId } = await db.collection("users").insertOne({
      username: "existingUser",
      password: hashedPassword,
      isVerified: true,
    });

    const res = await request(app).post("/auth/login").send({
      username: "existingUser",
      password: "hashedpwd",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should not log in a user who is unverified", async () => {
    const hashedPassword = await bcrypt.hash("hashedpwd2", 10);
    const { insertedId } = await db.collection("users").insertOne({
      username: "existingUser2",
      password: hashedPassword,
      isVerified: false,
    });

    const res = await request(app).post("/auth/login").send({
      username: "existingUser2",
      password: "hashedpwd2",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("User is not verified");
  });
});
