import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../services/mail/mailer.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";
import { connectDB } from "../database/connection.js";
import { templates } from "../services/mail/templater.js";

/**
 * POST /auth/register
 *
 * Register a new user.
 *
 * Request body:
 * {
 *  username: string,
 *  email: string,
 *  password: string
 * }
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = await connectDB();
    const userCollection = db.collection("users");

    // Check if username is already registered
    const existingUsername = await userCollection.findOne({ username });
    if (existingUsername) {
      // HTTP status 409 means conflict
      return res.status(409).json({ error: ErrorMsg.USERNAME_TAKEN });
    }

    // Check if email is already registered
    const existingEmail = await userCollection.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: ErrorMsg.EMAIL_TAKEN });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Insert the new user into the collection
    const newUser = {
      username,
      email,
      password: hash,
      isVerified: false,
      isAdmin: false,
    };
    const { insertedId } = await userCollection.insertOne(newUser);

    // Generate verification token
    const token = jwt.sign({ userId: insertedId }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Generate the 'verify your account' email
    const htmlContent = templates.verifyEmail(username, email, token);
    const mailData = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "RealTalk: Verify your account",
      html: htmlContent,
    };

    // Send the email
    transporter.sendMail(mailData, (err, info) => {
      if (err) throw err;
    });

    // 201 status means the user was created successfully
    res.status(201).json({ message: SuccessMsg.REGISTRATION_OK });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: ErrorMsg.SERVER_ERROR });
  }
};

/**
 * POST /auth/login
 *
 * Authenticate the user's login credentials. Return an authentication token if
 * successful.
 *
 * Request body:
 * {
 *  username: string,
 *  password: string
 * }
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectDB();
    const userCollection = db.collection("users");

    // Check if user exists
    const user = await userCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: ErrorMsg.NO_SUCH_USERNAME });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ error: ErrorMsg.UNVERIFIED_USER });
    }

    // Compare password attempt against the password in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) throw err;

      if (result) {
        // If the password is correct, create a token and send it to the user
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        return res.status(200).json({ token });
      } else {
        // Else if the password is incorrect, return 401 meaning unauthorized
        return res.status(401).json({ error: ErrorMsg.WRONG_PASSWORD });
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: ErrorMsg.SERVER_ERROR });
  }
};

/**
 * POST /auth/verify-email
 *
 * Verify the user's email address. Requires an authorisation token.
 *
 * Request body:
 * {
 *  email: string,
 *  token: string
 * }
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;
    const db = await connectDB();
    const userCollection = db.collection("users");

    // Check if user exists
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: ErrorMsg.NO_SUCH_EMAIL });
    }

    // Verify token
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: ErrorMsg.INVALID_TOKEN });
      }

      // Update user's verification status to true
      await userCollection.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: { isVerified: true } }
      );

      return res.status(200).json({ message: SuccessMsg.VERIFICATION_OK });
    });
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ error: ErrorMsg.INVALID_TOKEN });
  }
};

/**
 * POST /auth/forgot-password
 *
 * Send an email to the user with a password reset token.
 *
 * Request body:
 * {
 *  email: string
 * }
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const db = await connectDB();
    const userCollection = db.collection("users");

    // Check if user exists
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: ErrorMsg.NO_SUCH_EMAIL });
    }

    // Generate password reset token
    const token = jwt.sign(
      {
        type: "password-reset",
        userId: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    // Generate 'forgot password' email
    const username = user.username;
    const htmlContent = templates.forgotPassword(username, token);
    const mailData = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "RealTalk: Forgotten password",
      html: htmlContent,
    };

    // Send email
    transporter.sendMail(mailData, (err, info) => {
      if (err) throw err;
    });

    return res.status(200).json({ message: SuccessMsg.RESET_EMAIL_OK });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: ErrorMsg.SERVER_ERROR });
  }
};

/**
 * POST /auth/reset-password
 *
 * Update the user's password with a new one. Requires an authorisation token.
 *
 * Request body:
 * {
 *  token: string,
 *  password: string
 * }
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const db = await connectDB();
    const userCollection = db.collection("users");

    // Verify token to check user is authorised to reset the password
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: ErrorMsg.INVALID_TOKEN });
      }

      // Update (reset) password with new requested password
      const hash = await bcrypt.hash(password, 10);
      await userCollection.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: { password: hash } }
      );

      return res.status(200).json({ message: SuccessMsg.PASSWORD_UPDATE_OK });
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: ErrorMsg.SERVER_ERROR });
  }
};
