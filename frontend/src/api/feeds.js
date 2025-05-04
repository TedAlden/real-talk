import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function getFollowingFeed(userId, { limit, offset }) {
  try {
    const response = await axiosInstance.get(
      `/api/feeds/following/${userId}?limit=${limit}&offset=${offset}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getLatestFeed({ limit, offset }) {
  try {
    const response = await axiosInstance.get(
      `/api/feeds/latest?limit=${limit}&offset=${offset}`
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
