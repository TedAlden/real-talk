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

//Logs in the given user
async function loginUser(user) {
  try {
    //Makes a POST request to the "/users/login" endpoint. Auth stuff is usually POST because it's more secure.
    const response = await axiosInstance.post("/users/login", user);
    //Log the response for debugging purposes and return the response
    //The response should contain a token which we can use to authenticate the user on protected endpoints.
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      //If error has a response, it means the request reached the backend but it sent back an error.
      console.error("Backend error:", error.response.data);
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error.message);
    }
  }
}

async function registerUser(user) {
  try {
    //Makes a POST request to the "/users/register" endpoint. Auth stuff is usually POST because it's more secure.
    const response = await axiosInstance.post("/users/register", user);
    //Log the response for debugging purposes and return the response.
    //Usually the response is the info of the newly registered user or maybe a token so they can be logged in immediately.
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      //If error has a response, it means the request reached the backend but it sent back an error.
      console.error("Backend error:", error.response.data);
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error.message);
    }
  }
}

export { getUsers, loginUser, registerUser };
