import express from "express";
import {
  getStatsByResourceController,
  getStatsSummaryController,
  logManualHitController
} from "../../controllers/statsController/stats.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { statsQuerySchema, validate } from "../../validations/stats.validation.js";

const router = express.Router();

// Publicly log manual hits (e.g. from client actions)
router.post("/stats/log", logManualHitController);

// Protect stats dashboard metrics for staff/admin only
router.get("/admin/stats/summary", protect, authorize("admin"), validate(statsQuerySchema), getStatsSummaryController);
router.get("/admin/stats/by-resource", protect, authorize("admin"), getStatsByResourceController);

export default router;
