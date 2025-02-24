import axiosInstance from "./axios";

//Gets a list of all users from the backend
async function getUsers() {
  try {
    //Makes a GET request to the "/users" endpoint.
    const response = await axiosInstance.get("/users");
    //Log the response for debugging purposes and return the response
    //The response is expected to be a list of user objects
    console.log(response);
    return response;
  } catch (error) {
    //If error has a response, it means the request reached the backend but it sent back an error.
    if (error.response) {
      console.error("Backend error:", error.response.data);
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error.message);
    }
  }
}

export { getUsers };
