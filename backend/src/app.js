import "dotenv/config.js";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

//Starts express
const app = express();
//Allows the frontend to communicate with the backend
app.use(cors());
//Allows the backend to parse JSON objects
app.use(express.json());
//Add routes
app.use("/auth", authRouter);
/* 
GET   localhost:<port>/users
POST  localhost:<port>/auth/register
POST  localhost:<port>/auth/login
*/

export default app;
