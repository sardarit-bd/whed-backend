import express from "express";
import {
  addDegreeFos,
  createDegree,
  deleteDegree,
  getAllDegrees,
  getSingleDegree,
  updateDegree
} from "../../controllers/degreeController/degree.controller.js";
import {
  degreeFosSchema,
  degreeSchema,
  updateDegreeSchema,
  validate
} from "../../validations/degree.validation.js";

const router = express.Router();

router.get("/degrees", getAllDegrees);
router.get("/degree/:id", getSingleDegree);
router.post("/degree", validate(degreeSchema), createDegree);
router.put("/degree/:id", validate(updateDegreeSchema), updateDegree);
router.delete("/degree/:id", deleteDegree);

// FOS link mapping
router.post("/degree/:id/fos", validate(degreeFosSchema), addDegreeFos);

export default router;
