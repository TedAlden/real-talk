import request from "supertest";
import jest from "jest-mock";

import app from "../src/app.js";
import { connectDB, closeDB } from "../src/database/connection.js";
import transporter from "../src/services/mail/mailer.js";
import { ErrorMsg, SuccessMsg } from "../src/services/responseMessages.js";

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
    await request(app)
      .post("/auth/register")
      .send({
        username: "UserToBeVerified",
        email: "test@example.com",
        password: "Password@1",
        date_of_birth: new Date("2000-01-01"),
        isVerified: false,
      });
  });

  afterAll(async () => {
    sendMailMock.mockRestore();
    await closeDB(db);
  });

  let consoleSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
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

    expect(res.body).toHaveProperty("message", SuccessMsg.VERIFICATION_OK);
    expect(res.statusCode).toBe(200);
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

    expect(res.body.error).toBe(ErrorMsg.NO_SUCH_EMAIL);
    expect(res.statusCode).toBe(400);
  });

  test("should not verify user if the token is invalid", async () => {
    const res = await request(app).post("/auth/verify-email").send({
      email: "test@example.com",
      token: "TokenFromTheTokenFairy",
    });

    expect(res.body.error).toBe(ErrorMsg.INVALID_TOKEN);
    expect(res.statusCode).toBe(400);
  });
});
