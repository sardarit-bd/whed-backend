import express from "express";
import {
  createContact,
  deleteContact,
  getAllContact,
  getSingleContact,
  updateContact
} from "../../controllers/contactController/contact.controller.js";
import contactSchema, { updateContactSchema, validate } from "../../validations/Contact.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";

const router = express.Router();

router.get("/contacts", getAllContact);
router.get("/contact/:id", getSingleContact);
router.post("/contact", protect, checkStateResponsibility, validate(contactSchema), createContact);
router.put("/contact/:id", protect, checkStateResponsibility, validate(updateContactSchema), updateContact);
router.delete("/contact/:id", protect, checkStateResponsibility, deleteContact);

export default router;
