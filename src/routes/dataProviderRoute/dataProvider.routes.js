import express from "express";
import {
  createDataProvider,
  deleteDataProvider,
  generateToken,
  getAllDataProviders,
  getDataProviderDetails,
  submitUpdates,
  updateDataProvider,
  verifyToken
} from "../../controllers/dataProviderController/dataProvider.controller.js";
import {
  dataProviderSchema,
  generateTokenSchema,
  submitUpdateSchema,
  updateDataProviderSchema,
  validate
} from "../../validations/dataProvider.validation.js";

const router = express.Router();

router.get("/private/dataproviders", getAllDataProviders);
router.get("/private/dataprovider/:id", getDataProviderDetails);
router.post("/private/dataprovider", validate(dataProviderSchema), createDataProvider);
router.put("/private/dataprovider/:id", validate(updateDataProviderSchema), updateDataProvider);
router.delete("/private/dataprovider/:id", deleteDataProvider);

// Workflow tokens
router.post("/private/dataprovider/generate-token", validate(generateTokenSchema), generateToken);
router.get("/private/dataprovider/verify/:token", verifyToken);
router.put("/private/dataprovider/submit/:token", validate(submitUpdateSchema), submitUpdates);

export default router;
