import "dotenv/config.js";
import express from "express";
import userRouter from "./routes/user.routes.js";

//Start express
const app = express();
app.use(express.json());
//Add routes
app.use("/users", userRouter);
/* 
GET   localhost:<port>/users
POST  localhost:<port>/users/register
POST  localhost:<port>/users/login
*/

//Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
