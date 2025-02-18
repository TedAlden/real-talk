import request from "supertest";
import app from "../src/app";

describe("User API", () => {
  test("should register a new user", async () => {
    const res = await request(app)
      .post("/users/register")
      .send({ username: "testuser", password: "password123" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });
});
