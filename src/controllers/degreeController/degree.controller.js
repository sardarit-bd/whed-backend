import {
  createDegree as createDegreeService,
  deleteDegree as deleteDegreeService,
  getAllDegrees as getAllDegreesService,
  getSingleDegree as getSingleDegreeService,
  linkDegreeFos as linkDegreeFosService,
  updateDegree as updateDegreeService
} from "../../services/degree.service.js";

/********** get all degrees **********/
const getAllDegrees = async (req, res) => {
  try {
    const orgId = req.query.orgId ? parseInt(req.query.orgId) : null;
    const credId = req.query.credId ? parseInt(req.query.credId) : null;

    const rows = await getAllDegreesService(orgId, credId);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No degrees found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Degrees fetched successfully",
      data: rows
    });
  } catch (error) {
    console.error('Get Degrees Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch degrees.'
    });
  }
};

/********** get single degree **********/
const getSingleDegree = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }
    const degree = await getSingleDegreeService(id);
    if (!degree) {
      return res.status(404).json({ success: false, message: "Degree not found." });
    }
    res.status(200).json({
      success: true,
      data: degree,
    });
  } catch (error) {
    console.error("Error fetching degree:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the degree!",
    });
  }
};

/********** create degree **********/
const createDegree = async (req, res) => {
  try {
    const result = await createDegreeService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "Degree created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create Degree Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create degree."
    });
  }
};

/********** update degree **********/
const updateDegree = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateDegreeService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Degree not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Degree updated successfully!",
    });
  } catch (err) {
    console.error("Error updating degree:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the degree.",
    });
  }
};

/********** delete degree **********/
const deleteDegree = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteDegreeService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Degree not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Degree deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting degree:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the degree.",
    });
  }
};

/********** link degree FOS **********/
const addDegreeFos = async (req, res) => {
  try {
    const { id } = req.params;
    const { fosCodes } = req.validatedBody;

    await linkDegreeFosService(id, fosCodes);
    res.status(200).json({
      success: true,
      message: "Degree fields of study updated successfully!"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addDegreeFos,
  createDegree,
  deleteDegree,
  getAllDegrees,
  getSingleDegree,
  updateDegree
};
