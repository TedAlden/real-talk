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

//Starts the server on the specified port in the .env file. If not found, defaults to 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
