import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function getFollowersById(target_id, viewer_id) {
  try {
    const response = await axiosInstance.get(
      `/api/users/${target_id}/followers?viewer_id=${viewer_id}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getFollowedById(target_id, viewer_id) {
  try {
    const response = await axiosInstance.get(
      `/api/users/${target_id}/followed?viewer_id=${viewer_id}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getFollowStatsById(target_id) {
  try {
    const response = await axiosInstance.get(
      `/api/users/${target_id}/follow_stats`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function checkIsFollowing(follower_id, followed_id) {
  try {
    const response = await axiosInstance.get(
      `/api/users/${follower_id}/is_following/${followed_id}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function followUser(follower_id, followed_id) {
  try {
    const follow = { follower_id, followed_id };
    const response = await axiosInstance.post(`/api/users/follows`, follow);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function unfollowUser(follower_id, followed_id) {
  try {
    const response = await axiosInstance.delete(
      `/api/users/${follower_id}/unfollow/${followed_id}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getSuggestedFollows(target_id, method) {
  try {
    const response = await axiosInstance.get(
      `/api/users/${target_id}/suggested_follows?method=${method}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
