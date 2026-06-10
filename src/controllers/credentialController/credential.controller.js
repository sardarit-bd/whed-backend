import {
  createCredential as createCredentialService,
  deleteCredential as deleteCredentialService,
  getAllCredentials as getAllCredentialsService,
  getSingleCredential as getSingleCredentialService,
  getTotalCredentials as getTotalCredentialsService,
  getCredentialsByStateId as getCredentialsByStateIdService,
  linkInstitutionTypes as linkInstitutionTypesService,
  linkPrerequisites as linkPrerequisitesService,
  updateCredential as updateCredentialService
} from "../../services/credential.service.js";

/********** get all credentials **********/
const getAllCredentials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const stateId = req.query.stateId ? parseInt(req.query.stateId) : null;
    const levelCode = req.query.levelCode || null;

    const [rows, total] = await Promise.all([
      getAllCredentialsService(limit, offset, stateId, levelCode),
      getTotalCredentialsService(stateId, levelCode)
    ]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No credentials found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Credentials fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit
      },
      data: rows
    });
  } catch (error) {
    console.error('Get Credentials Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch credentials.'
    });
  }
};

/********** get single credential **********/
const getSingleCredential = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }
    const credential = await getSingleCredentialService(id);
    if (!credential) {
      return res.status(404).json({ success: false, message: "Credential not found." });
    }
    res.status(200).json({
      success: true,
      data: credential,
    });
  } catch (error) {
    console.error("Error fetching credential:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the credential!",
    });
  }
};

/********** create credential **********/
const createCredential = async (req, res) => {
  try {
    const result = await createCredentialService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "Credential created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create Credential Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create credential."
    });
  }
};

/********** update credential **********/
const updateCredential = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateCredentialService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Credential not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Credential updated successfully!",
    });
  } catch (err) {
    console.error("Error updating credential:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the credential.",
    });
  }
};

/********** delete credential **********/
const deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteCredentialService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Credential not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Credential deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting credential:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the credential.",
    });
  }
};

/********** add prerequisites **********/
const addPrerequisites = async (req, res) => {
  try {
    const { id } = req.params;
    const { requiredCredIds } = req.validatedBody;

    await linkPrerequisitesService(id, requiredCredIds);
    res.status(200).json({
      success: true,
      message: "Credential prerequisites updated successfully!"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/********** add institution types **********/
const addInstitutionTypes = async (req, res) => {
  try {
    const { id } = req.params;
    const { instTypeIds } = req.validatedBody;

    await linkInstitutionTypesService(id, instTypeIds);
    res.status(200).json({
      success: true,
      message: "Credential institution types updated successfully!"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/********** get credentials by state **********/
const getCredentialsByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({ success: false, message: "Invalid state ID format." });
    }
    const credentials = await getCredentialsByStateIdService(stateId);
    res.status(200).json({
      success: true,
      data: credentials
    });
  } catch (error) {
    console.error("Error fetching credentials by state:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the credentials by state!"
    });
  }
};

export {
  addInstitutionTypes,
  addPrerequisites,
  createCredential,
  deleteCredential,
  getAllCredentials,
  getSingleCredential,
  getCredentialsByState,
  updateCredential
};
