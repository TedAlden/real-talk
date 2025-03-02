import axiosInstance from "./axios";

//Logs in the given user
export async function loginUser(user) {
  try {
    //Makes a POST request to the "/users/login" endpoint. Auth stuff is usually POST because it's more secure.
    const response = await axiosInstance.post("/auth/login", user);
    //Log the response for debugging purposes and return the response
    //The response should contain a token which we can use to authenticate the user on protected endpoints.
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      //If error has a response, it means the request reached the backend but it sent back an error.
      console.error("Backend error:", error);
      const code = error.response.status;
      const message = error.response.data.error;
      return { success: false, error: `Status ${code}: ${message}` };
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error);
      return { success: false, error: error };
    }
  }
}

export async function registerUser(user) {
  try {
    //Makes a POST request to the "/users/register" endpoint. Auth stuff is usually POST because it's more secure.
    const response = await axiosInstance.post("/auth/register", user);
    //Log the response for debugging purposes and return the response.
    //Usually the response is the info of the newly registered user or maybe a token so they can be logged in immediately.
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      //If error has a response, it means the request reached the backend but it sent back an error.
      console.error("Backend error:", error);
      const code = error.response.status;
      const message = error.response.data.error;
      return { success: false, error: `Status ${code}: ${message}` };
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error);
      return { success: false, error: error };
    }
  }
}

export async function sendResetEmail(user) {
  try {
    //Makes a POST request to the "/users/register" endpoint. Auth stuff is usually POST because it's more secure.
    const response = await axiosInstance.post("/auth/forgot-password", user);
    //Log the response for debugging purposes and return the response.
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      //If error has a response, it means the request reached the backend but it sent back an error.
      console.error("Backend error:", error);
      const code = error.response.status;
      const message = error.response.data.error;
      return { success: false, error: `Status ${code}: ${message}` };
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error);
      return { success: false, error: error };
    }
  }
}

export async function verifyEmail(user) {
  try {
    //Makes a POST request to the "/users/register" endpoint. Auth stuff is usually POST because it's more secure.
    const response = await axiosInstance.post("/auth/verify-email", user);
    //Log the response for debugging purposes and return the response.
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      //If error has a response, it means the request reached the backend but it sent back an error.
      console.error("Backend error:", error);
      const code = error.response.status;
      const message = error.response.data.error;
      return { success: false, error: `Status ${code}: ${message}` };
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error);
      return { success: false, error: error };
    }
  }
}

export async function resetPassword(user) {
  try {
    //Makes a POST request to the "/users/register" endpoint. Auth stuff is usually POST because it's more secure.
    const response = await axiosInstance.post("/auth/reset-password", user);
    //Log the response for debugging purposes and return the response.
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      //If error has a response, it means the request reached the backend but it sent back an error.
      console.error("Backend error:", error);
      const code = error.response.status;
      const message = error.response.data.error;
      return { success: false, error: `Status ${code}: ${message}` };
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error);
      return { success: false, error: error };
    }
  }
}

export async function verifyOTP(token, otp) {
  try {
    //Makes a POST request to the "/users/register" endpoint. Auth stuff is usually POST because it's more secure.
    const response = await axiosInstance.post("/auth/verify-otp", {
      token,
      otp,
    });
    //Log the response for debugging purposes and return the response.
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      //If error has a response, it means the request reached the backend but it sent back an error.
      console.error("Backend error:", error);
      const code = error.response.status;
      const message = error.response.data.error;
      return { success: false, error: `Status ${code}: ${message}` };
    } else {
      //Otherwise, it's an error with the request
      console.error("Error:", error);
      return { success: false, error: error };
    }
  }
}
