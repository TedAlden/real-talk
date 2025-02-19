import request from "supertest";
import app from "../src/app.js";
import db from "../src/db/connection.js";
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
    const hashedPassword1 = await bcrypt.hash("password1", 10);
    const hashedPassword2 = await bcrypt.hash("password2", 10);
    await db.collection("users").insertMany([
      {
        username: "VerifiedUser",
        password: hashedPassword1,
        isVerified: true,
      },
      {
        username: "UnverifiedUser",
        password: hashedPassword2,
        isVerified: false,
      },
    ]);
  });

  afterAll(async () => {
    await userCollection.deleteMany({});
  });

  test("should log in a user who is verified and exists", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "VerifiedUser",
      password: "password1",
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
