import { preHashedPasswords } from "./preHashedPasswords";

/**
 * Print all items in a collection to the console. Used for manual debugging and
 * testing purposes.
 *
 * @param {*} db The database object to use to access the collection.
 * @param {*} collectionName The name of the collection to print.
 */
export async function printCollection(db, collectionName) {
  try {
    const items = await db.collection(collectionName).find().toArray();
    console.log("retrieved items:", items);
  } catch (err) {
    console.error("Error retrieving items:", err);
  }
}

/**
 * Create test users in the database for testing purposes.
 *
 * @param {*} db The database connection to use
 * @param {number} count Number of test users to create (default: 3)
 * @param {Array<Object>} customProps Array of objects with custom properties
 * to set for each user. Length must match the count of users to create.
 * @returns {Object} Object with insertedIds and users array
 */
export async function createTestUsers(db, count, customProps = []) {
  if (customProps.length > 0 && customProps.length !== count) {
    throw new Error(
      "Length of customProps array must match the count of users to create."
    );
  }

  try {
    const usersToInsert = Array.from({ length: count }, (_, i) => ({
      username: `testuser${i + 1}`,
      email: `testuser${i + 1}@testemail.com`,
      password: preHashedPasswords[`password${i + 1}`],
      first_name: `First${i + 1}`,
      last_name: `Last${i + 1}`,
      biography: `Hi I am test user ${i + 1}. My password is password${i + 1}`,
      is_verified: true,
      mfa: {
        enabled: false,
        secret: "",
      },
      is_admin: false,
      ...(customProps[i] || {}),
    }));

    const result = await db.collection("users").insertMany(usersToInsert);

    return {
      insertedIds: result.insertedIds,
      users: usersToInsert.map((user, index) => ({
        ...user,
        _id: result.insertedIds[index],
      })),
    };
  } catch (err) {
    console.error("Error creating test users:", err);
    throw err;
  }
}
