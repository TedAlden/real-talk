import { connectDB } from "../database/connection.js";
import { ObjectId } from "mongodb";
import { ErrorMsg, SuccessMsg } from "../services/responseMessages.js";
import { matchedData } from "express-validator";

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
  const db = await connectDB();

  const { username, email, id } = req.query;
  const filter = {};
  if (username) filter.username = username;
  if (email) filter.email = email;
  if (id) filter._id = new ObjectId(id);

  try {
    const users = await db
      .collection("users")
      .find(filter, { projection: { password: false } }) // Exclude password
      .toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  const { id } = req.params;
  const db = await connectDB();
  const userCollection = db.collection("users");

  const user = await userCollection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
  }

  res.status(200).json(user);
};

/**
 * PUT /users/:id
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
 *  password: string
 * }
 */
export const updateUserById = async (req, res) => {
  const { id } = req.params;

  const db = await connectDB();
  const userCollection = db.collection("users");

  const user = await userCollection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
  }

  const updatedUser = matchedData(req);

  await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedUser }
  );

  res.status(200).json({ message: SuccessMsg.USER_UPDATE_OK });
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
  const { id } = req.params;
  const db = await connectDB();
  const userCollection = db.collection("users");

  const user = await userCollection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    return res.status(404).json({ error: ErrorMsg.NO_SUCH_ID });
  }

  await userCollection.deleteOne({ _id: new ObjectId(id) });

  res.status(200).json({ message: SuccessMsg.USER_DELETE_OK });
};
