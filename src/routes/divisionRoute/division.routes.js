import express from "express";
import {
  addDivisionFos,
  createDivision,
  deleteDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision
} from "../../controllers/divisionController/division.controller.js";
import {
  divisionFosSchema,
  divisionSchema,
  updateDivisionSchema,
  validate
} from "../../validations/division.validation.js";

const router = express.Router();

router.get("/divisions", getAllDivisions);
router.get("/division/:id", getSingleDivision);
router.post("/division", validate(divisionSchema), createDivision);
router.put("/division/:id", validate(updateDivisionSchema), updateDivision);
router.delete("/division/:id", deleteDivision);

// FOS link mapping
router.post("/division/:id/fos", validate(divisionFosSchema), addDivisionFos);

export default router;
