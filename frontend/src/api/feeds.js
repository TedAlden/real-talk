import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function getFollowingFeed(userId) {
  try {
    const response = await axiosInstance.get(
      `/api/feeds/latest/${userId}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getLatestFeed() {
  try {
    const response = await axiosInstance.get(
      `/api/feeds/latest`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getTrendingFeed() {
  try {
    const response = await axiosInstance.get(
      `/api/feeds/trending`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
