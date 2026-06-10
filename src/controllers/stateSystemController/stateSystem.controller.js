import {
  createDecree as createDecreeService,
  createSchool as createSchoolService,
  createStateSystem as createStateSystemService,
  deleteDecree as deleteDecreeService,
  deleteSchool as deleteSchoolService,
  deleteStateSystem as deleteStateSystemService,
  getDecreesByStateId as getDecreesByStateIdService,
  getSchoolsByStateId as getSchoolsByStateIdService,
  getStateSystemByStateId as getStateSystemByStateIdService,
  getStateSystems as getStateSystemsService,
  getTotalStateSystems as getTotalStateSystemsService,
  updateDecree as updateDecreeService,
  updateSchool as updateSchoolService,
  updateStateSystem as updateStateSystemService
} from "../../services/stateSystem.service.js";

/********** get all state systems **********/
const getAllStateSystems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      getStateSystemsService(limit, offset),
      getTotalStateSystemsService()
    ]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No state systems found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "State systems fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit
      },
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
const getStateSystemDetails = async (req, res) => {
  try {
    const { stateId } = req.params;
    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({ success: false, message: "Invalid state ID format." });
    }
    const system = await getStateSystemByStateIdService(stateId);
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

/********** delete state system **********/
const deleteStateSystem = async (req, res) => {
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
    const result = await createSchoolService(req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editSchool = async (req, res) => {
  try {
    const { stateId, levelCode } = req.params;
    const result = await updateSchoolService(stateId, levelCode, req.validatedBody);
    res.status(200).json({ success: true, message: "School updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeSchool = async (req, res) => {
  try {
    const { stateId, levelCode } = req.params;
    await deleteSchoolService(stateId, levelCode);
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
    const result = await createDecreeService(req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editDecree = async (req, res) => {
  try {
    const { decreeId } = req.params;
    await updateDecreeService(decreeId, req.validatedBody);
    res.status(200).json({ success: true, message: "Decree updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeDecree = async (req, res) => {
  try {
    const { decreeId } = req.params;
    await deleteDecreeService(decreeId);
    res.status(200).json({ success: true, message: "Decree deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addDecree,
  addSchool,
  createStateSystem,
  deleteStateSystem,
  editDecree,
  editSchool,
  getAllStateSystems,
  getDecrees,
  getSchools,
  getStateSystemDetails,
  removeDecree,
  removeSchool,
  updateStateSystem
};
