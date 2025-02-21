// tests/testUtils.js
import bcrypt from "bcrypt";

/**
 * Clears all documents from the users collection.
 */
export async function clearUsers(db) {
  await db.collection("users").deleteMany({});
}

/**
 * Inserts a common set of “existing” users into the DB.
 * Adjust as needed to cover your user registration, login, or other scenarios.
 */
export async function seedUsers(db) {
  const staticSalt = "$2b$12$abcdefghijklmnopqrstuv";

  // Example users; expand or modify as needed.
  const users = [
    {
      username: "ExistingUser",
      email: "test.email@gmail.com",
      // Just an example of a hashed password
      password: await bcrypt.hash("existing1", staticSalt),
      isVerified: true,
    },
    {
      username: "UnverifiedUser",
      email: "unverified.email@gmail.com",
      password: await bcrypt.hash("unverified1", staticSalt),
      isVerified: false,
    },
    {
      username: "VerifiedUser",
      email: "verified.email@gmail.com",
      password: await bcrypt.hash("verified1", staticSalt),
      isVerified: true,
    },
    {
      username: "unverifiedUser",
      email: "unverified.email@gmail.com",
      password: await bcrypt.hash("unverifiedPassword", staticSalt),
      isVerified: false,
    },
    // ...add more users as needed
  ];

  await db.collection("users").insertMany(users);
}

export async function printCollection(db, collectionName) {
  try {
    const items = await db.collection(collectionName).find().toArray();
    console.log("retrieved items:", items);
  } catch (err) {
    console.error("Error retrieving items:", err);
  }
}
