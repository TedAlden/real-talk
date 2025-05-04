import {
  Modal,
  Textarea,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useState } from "react";
import _ from "lodash";
import { createReport } from "../api/adminService";
const validTypes = ["user", "post", "comment"];

export default function ReportWindow({
  target,
  targetType,
  reporter,
  onClose,
  visible = false,
}) {
  const [status, setStatus] = useState("creating");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  if (!validTypes.includes(targetType) || !target || !reporter) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const report = {
        target: target,
        targetType: targetType,
        reporter: { _id: reporter._id, username: reporter.username },
        content: content,
      };
      const response = await createReport(report);
      if (response.success !== false) {
        setStatus("success");
      } else {
        setError(response?.message);
        setStatus("failure");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      setError(error?.message);
      setStatus("failure");
    }
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  const handleRetry = () => {
    setStatus("creating");
  };

  const buttonClasses = `
  w-full rounded-md px-6 py-2 transition sm:w-min text-white text-sm font-semibold
  ${status === "submitting" ? "opacity-70 cursor-not-allowed" : ""} 
`;

  return (
    <Modal show={visible} onClose={handleCancel} data-testid="report">
      <ModalHeader>Report {_.capitalize(targetType)}</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <div className="flex flex-col gap-4">
          {status === "creating" && (
            <Textarea
              placeholder="Describe why you’re reporting this…"
              required
              rows={3}
              className="w-full resize-none"
              data-testid="report-textarea"
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          )}
          {status === "failure" && (
            <div data-testid="report-failure-text">
              <p>An error occured while creating the report: </p>
              <p>{error}</p>
            </div>
          )}
          {status === "success" && (
            <p data-testid="report-success-text">
              Report submitted successfully.
            </p>
          )}
        </div>
      </ModalBody>
      <ModalFooter className="justify-end">
        {status === "creating" && (
          <button
            type="submit"
            className={`${buttonClasses} bg-blue-500 hover:bg-blue-600`}
            onClick={handleSubmit}
            disabled={status === "submitting"}
            data-testid="report-submit-button"
          >
            Submit
          </button>
        )}
        {status === "failure" && (
          <button
            type="submit"
            className={`${buttonClasses} bg-blue-500 hover:bg-blue-600`}
            onClick={handleRetry}
            disabled={status === "submitting"}
            data-testid="report-retry-button"
          >
            Retry
          </button>
        )}
        {status === "success" ? (
          <button
            type="submit"
            className={`${buttonClasses} bg-blue-500 hover:bg-blue-600`}
            onClick={handleCancel}
            disabled={status === "submitting"}
            data-testid="report-finish-button"
          >
            Finish
          </button>
        ) : (
          <button
            type="button"
            className={`${buttonClasses} bg-red-500 hover:bg-red-600`}
            onClick={handleCancel}
            disabled={status === "submitting"}
            data-testid="report-cancel-button"
          >
            Cancel
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
}
