import "dotenv/config.js";
import app from "./app.js";

// Starts the server on the specified port in the .env file. If not found,
// defaults to 5001
const PORT = parseInt(process.env.PORT, 10) || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
