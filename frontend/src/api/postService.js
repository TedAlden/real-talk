import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function createPost(post) {
  try {
    const response = await axiosInstance.post("/api/posts", post);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getPostByQuery(query_type, query) {
  try {
    const response = await axiosInstance.get(
      `/api/posts?${query_type}=${query}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getPostById(_id) {
  try {
    const response = await axiosInstance.get(`/api/posts/${_id}`);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function updatePost(_id, post) {
  try {
    const response = await axiosInstance.patch(`/api/posts/${_id}`, post);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function deletePostById(_id) {
  try {
    const response = await axiosInstance.delete(`/api/posts/${_id}`);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function likePost(_id, userId, isLiked) {
  try {
    const response = await axiosInstance.post(`/api/posts/${_id}/likes`, {
      userId,
      isLiked,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function createPostComment(_id, comment) {
  try {
    console.log("Creating comment:", comment);
    const response = await axiosInstance.post(
      `/api/posts/${_id}/comments`,
      comment,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getPostComments(_id) {
  try {
    const response = await axiosInstance.get(`/api/posts/${_id}/comments`);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
