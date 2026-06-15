import express from "express";
import { getAllCredentials, getSingleCredentialbystateID, getCredentialsByStateId } from "../../controllers/credentialController/credential.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

//all get route
router.get("/private/credentials", protect, authorize(0, 1), getAllCredentials);
router.get("/private/state/:stateId/credentials", protect, authorize(0, 1), getCredentialsByStateId);
router.get("/private/state/:stateId/credential/:id", protect, authorize(0, 1), getSingleCredentialbystateID);


// //all post route
// router.post("/private/state/:stateId/credential", protect, authorize(1, 0), checkStateResponsibility, validate(credentialSchema), createCredential);
// router.post("/private/state/:stateId/credential/:id/prerequisites", protect, authorize(1, 0), checkStateResponsibility, validate(prerequisiteSchema), addPrerequisites);
// router.post("/private/state/:stateId/credential/:id/inst-types", protect, authorize(1, 0), checkStateResponsibility, validate(instTypeLinkSchema), addInstitutionTypes);


// //all put route
// router.put("/private/state/:stateId/credential/:id", protect, authorize(1, 0), checkStateResponsibility, validate(updateCredentialSchema), updateCredential);
// router.put("/private/state/:stateId/credential/:id/prerequisites", protect, authorize(1, 0), checkStateResponsibility, validate(updatePrerequisiteSchema), updatePrerequisites);
// router.put("/private/state/:stateId/credential/:id/inst-types", protect, authorize(1, 0), checkStateResponsibility, validate(updateInstTypeLinkSchema), updateInstitutionTypes);


// // all delete route
// router.delete("/private/state/:stateId/credential/:id", protect, authorize(1, 0), checkStateResponsibility, deleteCredential);
// router.delete("/private/state/:stateId/credential/:id/prerequisites", protect, authorize(1, 0), checkStateResponsibility, validate(updatePrerequisiteSchema), updatePrerequisites);
// router.delete("/private/state/:stateId/credential/:id/inst-types", protect, authorize(1, 0), checkStateResponsibility, validate(updateInstTypeLinkSchema), updateInstitutionTypes);



export default router;
