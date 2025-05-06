import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function loginUser(username, password) {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function registerUser(user) {
  const { username, email, password, date_of_birth } = user;

  try {
    const response = await axiosInstance.post("/auth/register", {
      username,
      email,
      password,
      date_of_birth,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function sendResetEmail(email) {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function verifyEmail(email, token) {
  try {
    const response = await axiosInstance.post("/auth/verify-email", {
      email,
      token,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const response = await axiosInstance.post("/auth/reset-password", {
      token,
      password: newPassword,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function verifyOTP(token, otp) {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", {
      token,
      otp,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
