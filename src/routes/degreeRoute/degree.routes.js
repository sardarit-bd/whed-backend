import express from "express";
import {
  addDegreeFos,
  createDegree,
  deleteDegree,
  deleteDegreeFos,
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

router.get("/private/degrees", getAllDegrees);
router.get("/private/degree/:id", getSingleDegree);
router.post("/private/degree", validate(degreeSchema), createDegree);
router.put("/private/degree/:id", validate(updateDegreeSchema), updateDegree);
router.delete("/private/degree/:id", deleteDegree);

// FOS link mapping
router.post("/private/degree/fos", validate(degreeFosSchema), addDegreeFos);
router.delete("/private/degree/:degreeId/fos/:fieldCode", deleteDegreeFos);

export default router;
