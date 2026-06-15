import {
  createDataProvider as createDataProviderService,
  deleteDataProvider as deleteDataProviderService,
  generateSecurityToken as generateSecurityTokenService,
  getDataProviderById as getDataProviderByIdService,
  getDataProviders as getDataProvidersService,
  submitDataProviderUpdates as submitDataProviderUpdatesService,
  updateDataProvider as updateDataProviderService,
  verifySecurityToken as verifySecurityTokenService
} from "../../services/dataProvider.service.js";

/********** get all data providers **********/
const getAllDataProviders = async (req, res) => {
  try {
    const status = req.query.status !== undefined ? parseInt(req.query.status) : null;

    const rows = await getDataProvidersService(status);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data providers found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data providers fetched successfully",
      data: rows
    });
  } catch (error) {
    console.error('Get Data Providers Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch data providers.'
    });
  }
};

/********** get single data provider **********/
const getDataProviderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }
    const dp = await getDataProviderByIdService(id);
    if (!dp) {
      return res.status(404).json({ success: false, message: "Data provider not found." });
    }
    res.status(200).json({
      success: true,
      data: dp,
    });
  } catch (error) {
    console.error("Error fetching data provider:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the data provider!",
    });
  }
};

/********** create data provider **********/
const createDataProvider = async (req, res) => {
  try {
    const result = await createDataProviderService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "Data provider created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create Data Provider Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create data provider."
    });
  }
};

/********** update data provider **********/
const updateDataProvider = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateDataProviderService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data provider not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Data provider updated successfully!",
    });
  } catch (err) {
    console.error("Error updating data provider:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the data provider.",
    });
  }
};

/********** delete data provider **********/
const deleteDataProvider = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteDataProviderService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data provider not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Data provider deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting data provider:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the data provider.",
    });
  }
};

/********** generate token **********/
const generateToken = async (req, res) => {
  try {
    const { email } = req.validatedBody;
    const isInstitution = req.body.isInstitution === true;
    const targetId = req.body.targetId ? parseInt(req.body.targetId) : null;

    const result = await generateSecurityTokenService(email, isInstitution, targetId);
    res.status(200).json({
      success: true,
      message: "Access token generated successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/********** verify token **********/
const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token parameter is required" });
    }

    const providerSession = await verifySecurityTokenService(token);
    res.status(200).json({
      success: true,
      message: "Token verified successfully! Session initialized.",
      data: providerSession
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

/********** submit updates **********/
const submitUpdates = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await submitDataProviderUpdatesService(token, req.validatedBody);

    res.status(200).json({
      success: true,
      message: "Institution profile submitted successfully! Sent for editor validation.",
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export {
  createDataProvider,
  deleteDataProvider,
  generateToken,
  getAllDataProviders,
  getDataProviderDetails,
  submitUpdates,
  updateDataProvider,
  verifyToken
};
