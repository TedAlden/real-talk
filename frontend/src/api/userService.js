import axiosInstance from "./axios";

async function getUsers() {
  try {
    const response = await axiosInstance.get("/users");
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Backend error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

async function loginUser(user) {
  try {
    const response = await axiosInstance.post("/users/login", user);
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Backend error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

async function registerUser(user) {
  try {
    const response = await axiosInstance.post("/users/register", user);
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Backend error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

export { getUsers, loginUser, registerUser };
