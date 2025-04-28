import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function getUsersByQuery(query_type, query) {
  try {
    const response = await axiosInstance.get(
      `/api/users?${query_type}=${query}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getUserById(_id) {
  try {
    const response = await axiosInstance.get(`/api/users/${_id}`);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function updateUser(_id, user) {
  try {
    const response = await axiosInstance.patch(`/api/users/${_id}`, user);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function deleteUserById(_id) {
  try {
    const response = await axiosInstance.delete(`/api/users/${_id}`);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

/**
 * Update the user's healthy days streak
 * Called when the user stays under their usage limits
 * 
 * @param {string} userId - ID of the user to update
 * @param {boolean} maintainedLimit - Whether the user stayed under their limit
 * @returns {Promise<Object>} Response data or error
 */
export async function updateHealthyStreak(userId, maintainedLimit) {
  if (!userId) {
    return {
      success: false,
      message: "User ID is required to update streak"
    };
  }
  
  try {
    const response = await axiosInstance.patch(
      `/api/users/${userId}/update-streak`,
      { maintained_limit: maintainedLimit }
    );
    return response;
  } catch (error) {
    console.error("Error updating healthy streak:", error);
    return apiErrorResponse(error);
  }
}
