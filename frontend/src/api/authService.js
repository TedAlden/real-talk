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
    return handleError(error);
  }
}

export async function sendResetEmail(email) {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    console.log(response);
    return response;
  } catch (error) {
    return handleError(error);
  }
}

export async function verifyEmail(email, token) {
  try {
    const response = await axiosInstance.post("/auth/verify-email", {
      email,
      token,
    });
    console.log(response);
    return response;
  } catch (error) {
    return handleError(error);
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const response = await axiosInstance.post("/auth/reset-password", {
      token,
      password: newPassword,
    });
    console.log(response);
    return response;
  } catch (error) {
    return handleError(error);
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
    return handleError(error);
  }
}
