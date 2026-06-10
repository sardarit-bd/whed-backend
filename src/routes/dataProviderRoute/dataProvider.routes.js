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

router.get("/dataproviders", getAllDataProviders);
router.get("/dataprovider/:id", getDataProviderDetails);
router.post("/dataprovider", validate(dataProviderSchema), createDataProvider);
router.put("/dataprovider/:id", validate(updateDataProviderSchema), updateDataProvider);
router.delete("/dataprovider/:id", deleteDataProvider);

// Workflow tokens
router.post("/dataprovider/generate-token", validate(generateTokenSchema), generateToken);
router.get("/dataprovider/verify/:token", verifyToken);
router.put("/dataprovider/submit/:token", validate(submitUpdateSchema), submitUpdates);

export default router;
