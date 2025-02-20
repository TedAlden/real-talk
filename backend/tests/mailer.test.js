import request from "supertest";
import app from "../src/app.js";
import db from "../src/db/connection.js";
import transporter from "../src/util/mailer.js"; // Import the mailer
import jest from "jest-mock";

const userCollection = db.collection("users");

describe("User email verification", () => {
  let sendMailMock;
  beforeAll(async () => {
    // Override sendMail to prevent actual email sending.
    sendMailMock = jest
      .spyOn(transporter, "sendMail")
      .mockImplementation((mailData, callback) => {
        // Immediately invoke the callback to simulate successful sending
        callback(null, { success: true });
      });
    await userCollection.deleteMany({});
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
  });

  afterEach(async () => {
    await userCollection.deleteMany({});
    sendMailMock.mockClear();
  });

  test("registration should send a verification email", async () => {
    const mailData = sendMailMock.mock.calls[0][0];

    expect(mailData.from).toBe(process.env.NODEMAILER_USER);
    expect(mailData.to).toBe("test@example.com");
    expect(mailData.subject).toBe("RealTalk: Verify your account");
  });
});
