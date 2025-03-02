import axiosInstance from "./axios";

/**
 * Handle axios API errors.
 *
 * @param {Object} error The error object from axios.
 * @returns {Object} An object with a success boolean and an error message.
 */
const handleError = (error) => {
  if (error.response) {
    // If error has a response, it means the request reached the backend but it
    // sent back an error.
    console.error("Backend error:", error);
    const code = error.response.status;
    const message = error.response.data.error;
    return { success: false, error: `Status ${code}: ${message}` };
  } else {
    // Otherwise, it's an error with the request
    console.error("Error:", error);
    return { success: false, error: error };
  }
};

/**
 * Login a user via the backend API.
 *
 * @param {string} username Username.
 * @param {string} password Password.
 * @returns {Object} The response object from the backend.
 */
export async function loginUser(username, password) {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });
    console.log(response);
    return response;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Register a user via the backend API.
 *
 * @param {string} username Username.
 * @param {string} email Email.
 * @param {string} password Password.
 * @returns {Object} The response object from the backend.
 */
export async function registerUser(username, email, password) {
  try {
    const response = await axiosInstance.post("/auth/register", {
      username,
      email,
      password,
    });
    console.log(response);
    return response;
  } catch (error) {
    handleError(error);
  }
}

export async function sendResetEmail(user) {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", user);
    console.log(response);
    return response;
  } catch (error) {
    handleError(error);
  }
}

export async function verifyEmail(user) {
  try {
    const response = await axiosInstance.post("/auth/verify-email", user);
    console.log(response);
    return response;
  } catch (error) {
    handleError(error);
  }
}

export async function resetPassword(user) {
  try {
    const response = await axiosInstance.post("/auth/reset-password", user);
    console.log(response);
    return response;
  } catch (error) {
    handleError(error);
  }
}

export async function verifyOTP(token, otp) {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", {
      token,
      otp,
    });
    console.log(response);
    return response;
  } catch (error) {
    handleError(error);
  }
}
