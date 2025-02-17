import "dotenv/config.js";
import express from "express";
import userRouter from "./routes/user.routes.js";
import cors from "cors";

//Starts express
const app = express();
//Allows the frontend to communicate with the backend
app.use(cors());
//Allows the backend to parse JSON objects
app.use(express.json());
//Add routes
app.use("/users", userRouter);
/* 
GET   localhost:<port>/users
POST  localhost:<port>/users/register
POST  localhost:<port>/users/login
*/

//Starts the server on the specified port in the .env file. If not found, defaults to 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
