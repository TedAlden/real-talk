import { connectDB } from "../database/connection.js";

/**
 * GET /users
 *
 * Get all users.
 */
export const getUsers = async (req, res) => {
  const db = await connectDB();
  const userCollection = db.collection("users");

  // Filter results to exclude password
  const results = await userCollection
    .find({}, { projection: { password: false } })
    .toArray();

  if (!results) {
    return res.status(204).json({ error: "No users found." });
  }
  res.status(200).json(results);
};
