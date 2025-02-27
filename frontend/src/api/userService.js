import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

//Gets a list of all users from the backend
async function getUsersByQuery(query_type, query) {
  try {
    const response = await axiosInstance.get(
      `/api/users?${query_type}=${query}`
    );
    //The response is expected to be a list of user objects
    console.log(response);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

async function getUserById(_id) {
  try {
    const response = await axiosInstance.get(`/api/users/${_id}`);
    console.log(response);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

async function updateUser(user) {
  try {
    const { _id } = user;
    const response = await axiosInstance.put(`/api/users/${_id}`, user);
    console.log(response);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

async function deleteUserById(_id) {
  try {
    const response = await axiosInstance.delete(`/api/users/${_id}`);
    console.log(response);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export { getUsersByQuery, getUserById, updateUser, deleteUserById };
