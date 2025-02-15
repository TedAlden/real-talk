import express from "express";
import db from "../db/dummy/dummy_database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

//Get user collection
const userCollection = db.collection("users");

//Get all users (excl password field)
userRouter.get("/", async (req, res) => {
  const results = await userCollection.find();
  res.send(results).status(200);
});

//Register new user
userRouter.post("/register", async (req, res) => {
  try {
    //Check if the username already exists
    const existingUser = await userCollection.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.status(409).json({ error: "That username is already taken" });
    }
    //Hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newDoc = req.body;
    const result = await userCollection.insertOne(newDoc);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// Authenticate user
userRouter.post("/login", async (req, res) => {
  try {
    const user = await userCollection.findOne({ username: req.body.username });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const token = jwt.sign({ userId: user._id }, "your-secret-key", {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      } else {
        // In practice probably shouldn't specify whether it's pwd or user that's wrong
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      // In practice probably shouldn't specify whether it's pwd or user that's wrong
      res.status(400).json({ error: "user doesn't exist" });
    }
  } catch (error) {
    console.error("Login error:", error); // Log the error details
    res.status(400).json({ error: "Login failed" });
  }
});

export default userRouter;
