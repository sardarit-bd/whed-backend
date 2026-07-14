import {
  createAgreementService,
  createDecree as createDecreeService,
  createLanguageService,
  createSchool as createSchoolService,
  createStageService,
  createStateSystem as createStateSystemService,
  createTypeOfHeisService,
  deleteAgreement,
  deleteDecree as deleteDecreeService,
  deleteLanguage,
  deleteSchool as deleteSchoolService,
  deleteStage,
  deleteStateSystem as deleteStateSystemService,
  deleteTypeOfHeisService,
  getAgreementByStateIDService,
  getDecreesByStateId as getDecreesByStateIdService,
  getEducationSystemByStateIdService,
  getSchoolsByStateId as getSchoolsByStateIdService,
  getStateSystems as getStateSystemsService,
  updateDecree as updateDecreeService,
  updateSchool as updateSchoolService,
  updateStageServices,
  updateStateSystem as updateStateSystemService,
  updateTypeOfHeisService
} from "../../services/educationSystem.service.js";

/********** get all state systems **********/
const getAllStateSystems = async (req, res) => {
  try {
    const rows = await getStateSystemsService();

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No state systems found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "State systems fetched successfully",
      data: rows
    });
  } catch (error) {
    console.error('Get State Systems Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch state systems.'
    });
  }
};



/********** get single state system **********/
const getEducationSystemByStateID = async (req, res) => {
  try {
    const { stateId } = req.params;

    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({ success: false, message: "Invalid state ID format." });
    }
    const system = await getEducationSystemByStateIdService(stateId);
    if (!system) {
      return res.status(404).json({ success: false, message: "State system not found." });
    }
    res.status(200).json({
      success: true,
      data: system,
    });
  } catch (error) {
    console.error("Error fetching state system:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the state system!",
    });
  }
};






/********** create state system **********/
const createStateSystem = async (req, res) => {
  try {
    const result = await createStateSystemService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "State system created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create State System Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create state system."
    });
  }
};






/********** create state system **********/
const createTypeOfHeis = async (req, res) => {
  try {
    const { stateId } = req.params;
    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({ success: false, message: "Invalid state ID format." });
    }
    const result = await createTypeOfHeisService(stateId, req.validatedBody);
    res.status(201).json({
      success: true,
      message: "State system created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create State System Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create state system."
    });
  }
};










/********** update state system **********/
const updateStateSystem = async (req, res) => {

  try {
    const { stateId } = req.params;
    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid state ID format.",
      });
    }

    const updateData = { ...req.validatedBody };


    const result = await updateStateSystemService(stateId, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "State system not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "State system updated successfully!",
    });
  } catch (err) {
    console.error("Error updating state system:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the state system.",
    });
  }
};




const updatetypeOfHeis = async (req, res) => {
  try {
    const { stateId, id } = req.params;
    if (!stateId || isNaN(stateId) || !id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid state ID format." });
    }
    const result = await updateTypeOfHeisService(stateId, id, req.validatedBody);
    res.status(200).json({
      success: true,
      message: "Type of Heis updated successfully!",
      data: result
    });
  } catch (error) {
    console.error("Error updating Type of Heis:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the Type of Heis.",
    });
  }
}





/********** delete state system **********/
const removeEducationsystem = async (req, res) => {
  try {
    const { stateId } = req.params;
    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid state ID format.",
      });
    }
    const result = await deleteStateSystemService(stateId);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "State system not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "State system deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting state system:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the state system.",
    });
  }
};

// Schools
const getSchools = async (req, res) => {
  try {
    const { stateId } = req.params;
    const schools = await getSchoolsByStateIdService(stateId);
    res.status(200).json({ success: true, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addSchool = async (req, res) => {

  try {

    const { stateId } = req.params;

    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({ success: false, message: "Invalid state ID format." });
    }

    const result = await createSchoolService(stateId, req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editSchool = async (req, res) => {
  try {
    const { stateId, schoolId } = req.params;
    const result = await updateSchoolService(stateId, schoolId, req.validatedBody);
    res.status(200).json({ success: true, message: "School updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeSchool = async (req, res) => {
  try {
    const { stateId, schoolId } = req.params;
    await deleteSchoolService(stateId, schoolId);
    res.status(200).json({ success: true, message: "School deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Decrees
const getDecrees = async (req, res) => {
  try {
    const { stateId } = req.params;
    const decrees = await getDecreesByStateIdService(stateId);
    res.status(200).json({ success: true, data: decrees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addDecree = async (req, res) => {
  try {
    const { stateId } = req.params;
    const result = await createDecreeService(stateId, req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editDecree = async (req, res) => {
  try {
    const { stateId, decreeID } = req.params;
    await updateDecreeService(stateId, decreeID, req.validatedBody);
    res.status(200).json({ success: true, message: "Decree updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeDecree = async (req, res) => {
  try {
    const { stateId, decreeID } = req.params;
    await deleteDecreeService(stateId, decreeID);
    res.status(200).json({ success: true, message: "Decree deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const removeTypeOfHeis = async (req, res) => {
  try {
    const { stateId, id } = req.params;

    await deleteTypeOfHeisService(stateId, id);
    res.status(200).json({ success: true, message: "Type of Heis deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const getAgreementByStateID = async (req, res) => {
  try {
    const { stateId } = req.params;

    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({ success: false, message: "Invalid state ID format." });
    }
    const system = await getAgreementByStateIDService(stateId);

    res.status(200).json({
      success: true,
      data: system,
    });
  } catch (error) {
    console.error("Error fetching state system:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the state system!",
    });
  }
}

const addAgreement = async (req, res) => {
  try {
    const { stateId } = req.params;
    const result = await createAgreementService(stateId, req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const removeAgreement = async (req, res) => {
  try {
    const { stateId, agreementId } = req.params;
    await deleteAgreement(stateId, agreementId);
    res.status(200).json({ success: true, message: "Agreement deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




const addLanguage = async (req, res) => {
  try {
    const { stateId } = req.params;
    const result = await createLanguageService(stateId, req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const removeLanguage = async (req, res) => {
  try {
    const { stateId, languagecode } = req.params;
    await deleteLanguage(stateId, languagecode);
    res.status(200).json({ success: true, message: "Language deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




const addStage = async (req, res) => {
  try {
    const { stateId } = req.params;
    const result = await createStageService(stateId, req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const updateStage = async (req, res) => {
  try {
    const { stateId, stageCode } = req.params;
    await updateStageServices(stateId, stageCode, req.validatedBody);
    res.status(200).json({ success: true, message: "Stage updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const removeStage = async (req, res) => {
  try {
    const { stateId, stageCode } = req.params;
    await deleteStage(stateId, stageCode);
    res.status(200).json({ success: true, message: "Stage deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export {
  addAgreement, addDecree, addLanguage, addSchool, addStage, createStateSystem, createTypeOfHeis, editDecree,
  editSchool, getAgreementByStateID, getAllStateSystems,
  getDecrees, getEducationSystemByStateID, getSchools, removeAgreement, removeDecree, removeEducationsystem, removeLanguage, removeSchool, removeStage, removeTypeOfHeis, updateStage, updateStateSystem, updatetypeOfHeis
};

