import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";
import { matchedData } from "express-validator";
import bcrypt from "bcrypt";

/**
 * GET /users?id={}&username={}&email={}
 *
 * Query users by username, email, and/or ID.
 *
 * Query parameters:
 * {
 *  id: string
 *  username: string,
 *  email: string,
 * }
 */
export const getUsersByQuery = async (req, res) => {
  try {
    const db = await connectDB();

    const { username, email, id } = req.query;
    const filter = {};
    if (username) filter.username = username;
    if (email) filter.email = email;
    if (id) filter._id = new ObjectId(id);

    const users = await db
      .collection("users")
      .find(filter, { projection: { password: false } }) // Exclude password
      .toArray();
    return res.status(200).json(users);
  } catch (err) {
    console.error("Get users by query error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /users/:id
 *
 * Get a user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: false } }
    );

    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /users/:id
 *
 * Update a user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 *
 * Request body:
 * {
 *  username: string,
 *  email: string,
 *  password: string,
 *  ...
 * }
 */
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await connectDB();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    // Check user exists
    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    // Check email is not taken
    const emailExists = await userCollection.findOne({ email: req.body.email });
    if (emailExists && emailExists._id.toString() !== id) {
      return res.status(400).json({ error: ErrorMsg.EMAIL_TAKEN });
    }

    // Check username is not taken
    const usernameExists = await userCollection.findOne({
      username: req.body.username,
    });
    if (usernameExists && usernameExists._id.toString() !== id) {
      return res.status(400).json({ error: ErrorMsg.USERNAME_TAKEN });
    }

    // Update the new user object with the validated fields
    const updatedUser = {
      ...matchedData(req),
    };

    console.log(req.body);

    // Hash password
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }

    // Update user in database
    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    res.status(200).json({ message: SuccessMsg.USER_UPDATE_OK });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /users/:id
 *
 * Delete a user by ID.
 *
 * Request parameters:
 * {
 *  id: string
 * }
 */
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
    }

    await userCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: SuccessMsg.USER_DELETE_OK });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: err.message });
  }
};
