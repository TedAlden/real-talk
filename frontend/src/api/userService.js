import axiosInstance from "./axios";

async function getUsers() {
  try {
    const response = await axiosInstance.get("/users");
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function loginUser(user) {
  try {
    const response = await axiosInstance.post("/users/login", user);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function registerUser(user) {
  try {
    const response = await axiosInstance.post("/users/register", user);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export { getUsers, loginUser, registerUser };
