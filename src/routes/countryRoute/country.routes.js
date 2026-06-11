import express from "express";
import { createCountry, deleteCountry, getAllCountries, getSingleCountry, updateCountry } from '../../controllers/countryController/country.controller.js';
import { countrySchema, updateCountrySchema, validate } from "../../validations/country.validation.js";
import { logProfileHit } from "../../middlewares/stats.middleware.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";

const router = express.Router();

router.get("/countries", getAllCountries);
router.get("/country/:id", logProfileHit("Country"), getSingleCountry);
router.post("/country", protect, validate(countrySchema), createCountry);
router.put("/country/:id", protect, checkStateResponsibility, validate(updateCountrySchema), updateCountry);
router.delete("/country/:id", protect, checkStateResponsibility, deleteCountry);

export default router;
