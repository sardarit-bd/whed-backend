import express from "express";
import {
  createDivision,
  deleteDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision
} from "../../controllers/divisionController/division.controller.js";
import {
  divisionSchema,
  updateDivisionSchema,
  validate
} from "../../validations/division.validation.js";

const router = express.Router();

router.get("/private/divisions", getAllDivisions);
router.get("/private/division/:id", getSingleDivision);
router.post("/private/division", validate(divisionSchema), createDivision);
router.put("/private/division/:id", validate(updateDivisionSchema), updateDivision);
router.delete("/private/division/:id", deleteDivision);

// FOS link mapping
// router.post("/private/division/:id/fos", validate(divisionFosSchema), addDivisionFos);

export default router;
