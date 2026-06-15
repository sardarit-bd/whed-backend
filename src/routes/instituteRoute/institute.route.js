import express from "express";
import { getAllInstitutes, getInstitutesByState } from '../../controllers/instituteController/institute.controller.js';
import { protect } from "../../middlewares/auth.middleware.js";


const router = express.Router();


//all get route
router.get("/private/institutes", protect, getAllInstitutes);
router.get("/private/state/:stateId/institutes", protect, getInstitutesByState);
// router.get("/private/state/:stateId/institute/:id", protect, getInstitutesByState);
// router.get("/private/state/:stateId/institute/:id/contacts", protect, getContacts);




// //all post route
// router.post("/private/state/:stateId/institute", protect, authorize(1, 0), checkStateResponsibility, validate(instituteSchema), createInstitute);



// //all put route
// router.put("/private/state/:stateId/institute/:id", protect, authorize(1, 0), checkStateResponsibility, validate(updateInstituteSchema), updateInstitute);



// //all delete route
// router.delete("/private/state/:stateId/institute/:id", protect, authorize(1, 0), checkStateResponsibility, deleteInstitute);






export default router;