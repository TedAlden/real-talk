import express from "express";
import db from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

//Collections are basically tables in MongoDB. Get the user table from the database.
const userCollection = db.collection("users");

//Gets all users from the database
//req is the request object (what the client sends to the server), res is the response object (what the server sends back to the client)
userRouter.get("/", async (req, res) => {
  //Find users in the collection with no filter, so everyone
  const results = await userCollection.find();
  //Send the results as a JSON object, status 200 means everything is OK
  res.send(results).status(200);
});

//Registers a new user. They should show up in the database after this
//req is the request object (what the client sends to the server), res is the response object (what the server sends back to the client)
//We should be sending a user object with the new user's details
userRouter.post("/register", async (req, res) => {
  try {
    //Find users in the collection with the given username. If there's a user with that username
    const existingUser = await userCollection.findOne({
      username: req.body.username,
    });
    //If there's a user with that username, send an error
    if (existingUser) {
      //Status 409 means conflict
      return res.status(409).json({ error: "That username is already taken" });
    }
    //Hash the password so it's not stored in plaintext
    const hash = await bcrypt.hash(req.body.password, 10);
    // the hash returned from bcrypt includes the password hash with the salt
    // appended in the same string i.e. "passwordhash.salt"

    //Insert the new user into the collection
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: hash,
      isVerified: false,
      isAdmin: false,
    };
    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: "Registration failed" });
  }
});

//Authenticate (login) the user
//req is the request object (what the client sends to the server), res is the response object (what the server sends back to the client)
//We should be sending a user object with a username and password
userRouter.post("/login", async (req, res) => {
  try {
    //Find the user with the given username
    const user = await userCollection.findOne({ username: req.body.username });
    //If there's a user with that username
    if (user) {
      //Compare the hashed password with the plaintext password
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        //If the password is correct, create a token
        const token = jwt.sign({ userId: user._id }, "your-secret-key", {
          expiresIn: "1h",
        });
        //Send the token back to the client. Status 200 means everything is OK
        res.status(200).json({ token });
      } else {
        //The password doesn't match so send an error
        //In practice probably shouldn't specify whether it's pwd or user that's wrong
        //Status 400 means bad request
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      //There's no user with that username so send an error
      //In practice probably shouldn't specify whether it's pwd or user that's wrong
      //Status 400 means bad request
      res.status(400).json({ error: "user doesn't exist" });
    }
  } catch (error) {
    //If there's an error, log it and send an error
    console.error("Login error:", error); // Log the error details
    //Status 400 means bad request
    res.status(400).json({ error: "Login failed" });
  }
});

export default userRouter;
