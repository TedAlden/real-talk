import express from "express";

import {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport,
  banTarget,
} from "../controllers/admin.js";

const adminRouter = express.Router();

adminRouter.post("/reports", createReport);
adminRouter.get("/reports", getReports);
adminRouter.patch("/reports/:id", updateReportStatus);
adminRouter.delete("/reports/:id", deleteReport);
adminRouter.post("/ban", banTarget);

export default adminRouter;
