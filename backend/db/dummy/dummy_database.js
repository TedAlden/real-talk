import fs from "fs";
import path from "path";

// Load the data (for persistence across sessions, you’d need to write back to the file)
const dbFilePath = path.resolve("./db/dummy/users.json");
let users = [];

try {
  const data = fs.readFileSync(dbFilePath, "utf8");
  users = JSON.parse(data);
} catch (err) {
  // If the file doesn't exist or is empty, start with an empty array.
  users = [];
}

// Simulated collection methods
const userCollection = {
  find: async (filter = {}, projection = {}) => {
    // For simplicity, ignoring filter and projection in this example.
    return users.filter((user) => {
      let match = true;
      for (const key in filter) {
        if (user[key] !== filter[key]) {
          match = false;
          break;
        }
      }
      return match;
    });
  },
  findOne: async (filter = {}) => {
    return users.find((user) => {
      return Object.keys(filter).every((key) => user[key] === filter[key]);
    });
  },
  insertOne: async (doc) => {
    // Generate a simple id. In production, use something more robust.
    doc.id = String(users.length + 1);
    users.push(doc);
    // Optionally write back to file (synchronous for simplicity)
    fs.writeFileSync(dbFilePath, JSON.stringify(users, null, 2));
    return { insertedId: doc.id };
  },
};

export default {
  collection: (name) => {
    if (name === "users") return userCollection;
    throw new Error("Collection not found");
  },
};
