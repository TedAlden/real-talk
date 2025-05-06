import useAuth from "../hooks/useAuth";
import {
  getReports,
  deleteReport,
  updateReportStatus,
} from "../api/adminService";
import { useEffect, useState } from "react";
import { TabItem, Tabs } from "flowbite-react";
import { Link } from "react-router-dom";

import _ from "lodash";

/**
 * Admin dashboard page for managing user reports
 * Provides interfaces for viewing and handling active/resolved reports
 */
function Admin() {
  // State for admin check and reports data
  const auth = useAuth();
  const [reports, setReports] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status and load reports
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await auth.getUser();
        if (user && user.is_admin) {
          setIsAdmin(true);
          fetchReports();
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [auth]);

  // Load reports from API
  const fetchReports = async () => {
    try {
      const response = await getReports();
      if (response.success !== false) {
        setReports(response.data);
      } else {
        console.error("Error fetching reports:", response.message);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // Filter and sort reports by status
  const resolvedReports = reports
    .filter((report) => report.status === "resolved")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const activeReports = reports
    .filter((report) => report.status === "active")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Report action handlers
  const getTargetLink = (report) => {
    if (report.targetType === "user") {
      return `/profile/${report.target}`;
    } else if (report.targetType === "post") {
      return `/post/${report.target}`;
    } else if (report.targetType === "comment") {
      const { post_id, comment_id } = report.target;
      return `/post/${post_id}?comment=${comment_id}`;
    }
    return null;
  };

  const handleDeleteReport = async (reportId) => {
    const prev = reports;
    setReports((prevReports) =>
      prevReports.filter((report) => report._id !== reportId),
    );
    try {
      const response = await deleteReport(reportId);
      if (response.success === false) {
        setReports(prev);
        console.error("Error deleting report:", response.message);
      }
    } catch (error) {
      setReports(prev);
      console.error("Error deleting report:", error);
    }
  };

  const handleMarkReport = async (reportId, newStatus) => {
    const prev = reports;
    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === reportId ? { ...report, status: newStatus } : report,
      ),
    );

    try {
      const response = await updateReportStatus(reportId, newStatus);
      if (response.success === false) {
        setReports(prev);
        console.error("Error updating report status:", response.message);
      }
    } catch (error) {
      setReports(prev);
      console.error("Error updating report status:", error);
    }
  };

  return (
    <div className="items-center justify-center text-gray-900 dark:text-white">
      {isAdmin ? (
        <div className="container mx-auto w-full p-2 lg:w-3/5 2xl:w-1/2">
          <h1 className="mb-3 text-2xl font-bold">Admin Dashboard</h1>
          <Tabs>
            <TabItem active title="Active Reports">
              {activeReports?.length > 0 &&
                activeReports.map((report) => (
                  <div
                    key={report._id}
                    className="mb-4 rounded border bg-gray-50 shadow dark:border dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="text-md m-2 mb-1 flex items-center justify-between border-b border-gray-300 p-1 pb-3 dark:border-gray-700">
                      <span className="text-lg text-gray-900 dark:text-gray-100">
                        Reported {_.capitalize(report.targetType)} by{" "}
                        <Link
                          className="font-medium hover:underline"
                          to={`/profile/${report.reporter._id}`}
                        >
                          {"@" + report.reporter?.username || "Unknown"}
                        </Link>
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {new Date(report.timestamp).toLocaleDateString()}{" "}
                        {new Date(report.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-md mb-2">{report.content}</p>

                      <div className="flex justify-end gap-4 text-sm font-semibold text-blue-600 dark:text-blue-500">
                        <a
                          className="rounded-md p-1 hover:text-blue-400 dark:hover:text-blue-600"
                          href={getTargetLink(report)}
                          target="_blank"
                        >
                          View {_.capitalize(report.targetType)}
                        </a>
                        <button
                          className="rounded-md p-1 hover:text-blue-400 dark:hover:text-blue-600"
                          onClick={() =>
                            handleMarkReport(report._id, "resolved")
                          }
                        >
                          Mark Resolved
                        </button>
                        <button
                          className="rounded-md p-1 hover:text-blue-400 dark:hover:text-blue-600"
                          onClick={() => handleDeleteReport(report._id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {activeReports?.length === 0 && (
                <div className="py-2 text-center">
                  <p className="text-lg">No active reports</p>
                </div>
              )}
            </TabItem>
            <TabItem active title="Resolved Reports">
              {resolvedReports?.length > 0 &&
                resolvedReports.map((report) => (
                  <div
                    key={report._id}
                    className="mb-4 rounded border bg-gray-50 shadow dark:border dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="text-md m-2 mb-1 flex items-center justify-between border-b border-gray-300 p-1 pb-3 dark:border-gray-700">
                      <span className="text-lg text-gray-900 dark:text-gray-100">
                        Reported {_.capitalize(report.targetType)} by{" "}
                        <Link
                          className="font-medium hover:underline"
                          href={`/profile/${report.reporter._id}`}
                        >
                          {"@" + report.reporter?.username || "Unknown"}
                        </Link>
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {new Date(report.timestamp).toLocaleDateString()}{" "}
                        {new Date(report.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-md mb-2">{report.content}</p>

                      <div className="flex justify-end gap-4 text-sm font-semibold text-blue-600 dark:text-blue-500">
                        <a
                          className="rounded-md p-1 hover:text-blue-400 dark:hover:text-blue-600"
                          href={getTargetLink(report)}
                          target="_blank"
                        >
                          View {_.capitalize(report.targetType)}
                        </a>
                        <button
                          className="rounded-md p-1 hover:text-blue-400 dark:hover:text-blue-600"
                          onClick={() => handleMarkReport(report._id, "active")}
                        >
                          Mark Active
                        </button>
                        <button
                          className="rounded-md p-1 hover:text-blue-400 dark:hover:text-blue-600"
                          onClick={() => handleDeleteReport(report._id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {resolvedReports?.length === 0 && (
                <div className="py-2 text-center">
                  <p className="text-lg">No resolved reports</p>
                </div>
              )}
            </TabItem>
          </Tabs>
        </div>
      ) : (
        <p className="text-xl">
          Unauthorized user: This page is only accessible by admins.
        </p>
      )}
    </div>
  );
}

export default Admin;
