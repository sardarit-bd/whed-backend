import express from "express";
import { createCountry, deleteCountry, getAllCountries, getSingleCountry, updateCountry } from '../../controllers/countryController/country.controller.js';
import { protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { countrySchema, updateCountrySchema, validate } from "../../validations/country.validation.js";

const router = express.Router();

router.get("/private/countries", getAllCountries);
router.get("/private/country/:id", getSingleCountry);
router.post("/private/country", protect, validate(countrySchema), createCountry);
router.put("/private/country/:id", protect, checkStateResponsibility, validate(updateCountrySchema), updateCountry);
router.delete("/private/country/:id", protect, checkStateResponsibility, deleteCountry);

export default router;
