import express from "express";
import { createContact, deleteContact, getAllContact } from "../../controllers/contactController/contact.controller.js";


const router = express.Router();

/********* Import Here Controller Files **********/


router.post("/contact", createContact);
router.get("/contact", getAllContact);
router.delete("/contact/:id", deleteContact);




export default router;
