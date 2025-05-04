import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

export async function createReport(report) {
  try {
    const response = await axiosInstance.post(`/api/admin/reports`, report);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getReports() {
  try {
    const response = await axiosInstance.get(`/api/admin/reports`);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function updateReportStatus(reportId, newStatus) {
  try {
    if (newStatus !== "resolved" && newStatus !== "active") {
      return { error: "Invalid report status" };
    }
    const response = await axiosInstance.patch(
      `/api/admin/reports/${reportId}`,
      {
        status: newStatus,
      },
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function deleteReport(reportId) {
  try {
    const response = await axiosInstance.delete(
      `/api/admin/reports/${reportId}`,
    );
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function banTarget(target) {
  try {
    const response = await axiosInstance.post(`/api/admin/ban`, target);
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
