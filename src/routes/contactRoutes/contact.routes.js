import express from "express";
import {
  createContact,
  deleteContact,
  getAllContact,
  getSingleContact,
  updateContact
} from "../../controllers/contactController/contact.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import contactSchema, { updateContactSchema, validate } from "../../validations/Contact.validation.js";

const router = express.Router();

router.get("/private/contacts", getAllContact);
router.get("/private/contact/:id", getSingleContact);

// very need routes below
router.post("/private/contact", protect, checkStateResponsibility, validate(contactSchema), createContact);
router.put("/private/contact/:id", protect, checkStateResponsibility, validate(updateContactSchema), updateContact);
router.delete("/private/contact/:id", protect, checkStateResponsibility, deleteContact);

export default router;
