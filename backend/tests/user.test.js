import request from "supertest";
import app from "../src/app";
import db from "../src/db/connection";
import transporter from "../src/util/mailer.js"; // Import the mailer
import jest from "jest-mock";

describe("User registration", () => {
  beforeAll(() => {
    // Override sendMail to prevent actual email sending.
    transporter.sendMail = jest.fn((mailData, callback) => {
      callback(null, { response: "Test mode: Email not sent" });
    });
  });

  afterAll(() => {
    // Restore original implementation after tests.
    transporter.sendMail.mockRestore();
  });

  test("should register a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
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
});
