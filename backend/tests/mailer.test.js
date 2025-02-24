import request from "supertest";
import jest from "jest-mock";

import app from "../src/app.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import transporter from "../src/services/mail/mailer.js";

describe("User email verification", () => {
  let sendMailMock;
  let db;

  beforeAll(async () => {
    db = await connectDB();
    // Override sendMail to prevent actual email sending.
    sendMailMock = jest
      .spyOn(transporter, "sendMail")
      .mockImplementation((mailData, callback) => {
        // Immediately invoke the callback to simulate successful sending
        callback(null, { success: true });
      });
    await db.collection("users").deleteMany({}); // Delete all users from table
  });

  beforeEach(async () => {
    await request(app).post("/auth/register").send({
      username: "UserToBeVerified",
      email: "test@example.com",
      password: "password",
      isVerified: false,
    });
  });

  afterAll(async () => {
    sendMailMock.mockRestore();
    await closeDB(db);
  });

  afterEach(async () => {
    await db.collection("users").deleteMany({});
    sendMailMock.mockClear();
  });

  test("registration should send a verification email", async () => {
    const mailData = sendMailMock.mock.calls[0][0];

    expect(mailData.from).toBe(process.env.NODEMAILER_USER);
    expect(mailData.to).toBe("test@example.com");
    expect(mailData.subject).toBe("RealTalk: Verify your account");
  });

  test("the verification email token should verify the user", async () => {
    const mailData = sendMailMock.mock.calls[0][0];
    const token = mailData.html.match(
      /<a[^>]+id="token"[^>]+href="[^"]*\?token=([^"&]+)[^"]*"/
    )[1];

    const res = await request(app).post("/auth/verify-email").send({
      email: "test@example.com",
      token: token,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Email verified");
  });

  test("should not verify user if their email does not exist", async () => {
    const mailData = sendMailMock.mock.calls[0][0];
    const token = mailData.html.match(
      /<a[^>]+id="token"[^>]+href="[^"]*\?token=([^"&]+)[^"]*"/
    )[1];

    const res = await request(app).post("/auth/verify-email").send({
      email: "wrongemail@example.com",
      token: token,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User not found");
  });

  test("should not verify user if the token is invalid", async () => {
    const res = await request(app).post("/auth/verify-email").send({
      email: "test@example.com",
      token: "TokenFromTheTokenFairy",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid token");
  });
});
