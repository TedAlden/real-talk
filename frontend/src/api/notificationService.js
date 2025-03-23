import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function getNotificationsById(_id) {
  try {
    const response = await axiosInstance.get(`/api/users/${_id}/notifications`);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

// export async function readNotification(timestamp) {
//   try {
//     const response = await axiosInstance.patch(`/api/users/${_id}`, timestamp);
//     return response;
//   } catch (error) {
//     return apiErrorResponse(error);
//   }
// }

export async function deleteNotification(userId, notificationId) {
  try {
    const response = await axiosInstance.delete(
      `/api/users/${userId}/notifications/${notificationId}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
