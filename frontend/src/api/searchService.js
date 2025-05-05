import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function getSearchResults(query, { limit, offset }) {
  try {
    const response = await axiosInstance.get(
      `/api/search?query=${query}&limit=${limit}&offset=${offset}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}