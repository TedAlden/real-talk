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

export async function updateUser(user) {
  try {
    const { _id } = user;
    const response = await axiosInstance.put(`/api/users/${_id}`, user);
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
