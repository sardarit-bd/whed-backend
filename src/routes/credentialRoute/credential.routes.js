import express from "express";
import {
  addInstitutionTypes,
  addPrerequisites,
  createCredential,
  deleteCredential,
  getAllCredentials,
  getSingleCredential,
  getCredentialsByState,
  updateCredential
} from "../../controllers/credentialController/credential.controller.js";
import {
  credentialSchema,
  instTypeLinkSchema,
  prerequisiteSchema,
  updateCredentialSchema,
  validate
} from "../../validations/credential.validation.js";

const router = express.Router();

router.get("/credentials", getAllCredentials);
router.get("/credential/:id", getSingleCredential);
router.get("/credentials/state/:stateId", getCredentialsByState);
router.post("/credential", validate(credentialSchema), createCredential);
router.put("/credential/:id", validate(updateCredentialSchema), updateCredential);
router.delete("/credential/:id", deleteCredential);

// Link mappings
router.post("/credential/:id/prerequisites", validate(prerequisiteSchema), addPrerequisites);
router.post("/credential/:id/inst-types", validate(instTypeLinkSchema), addInstitutionTypes);

export default router;
