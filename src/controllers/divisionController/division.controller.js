import {
  createDivision as createDivisionService,
  deleteDivision as deleteDivisionService,
  getAllDivisions as getAllDivisionsService,
  getSingleDivision as getSingleDivisionService,
  getTotalDivisions as getTotalDivisionsService,
  linkDivisionFos as linkDivisionFosService,
  updateDivision as updateDivisionService
} from "../../services/division.service.js";

/********** get all divisions **********/
const getAllDivisions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const orgId = req.query.orgId ? parseInt(req.query.orgId) : null;

    const [rows, total] = await Promise.all([
      getAllDivisionsService(limit, offset, orgId),
      getTotalDivisionsService(orgId)
    ]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No divisions found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Divisions fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit
      },
      data: rows
    });
  } catch (error) {
    console.error('Get Divisions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch divisions.'
    });
  }
};

/********** get single division **********/
const getSingleDivision = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }
    const division = await getSingleDivisionService(id);
    if (!division) {
      return res.status(404).json({ success: false, message: "Division not found." });
    }
    res.status(200).json({
      success: true,
      data: division,
    });
  } catch (error) {
    console.error("Error fetching division:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the division!",
    });
  }
};

/********** create division **********/
const createDivision = async (req, res) => {
  try {
    const result = await createDivisionService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "Division created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create Division Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create division."
    });
  }
};

/********** update division **********/
const updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateDivisionService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Division not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Division updated successfully!",
    });
  } catch (err) {
    console.error("Error updating division:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the division.",
    });
  }
};

/********** delete division **********/
const deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteDivisionService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Division not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Division deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting division:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the division.",
    });
  }
};

/********** link division FOS **********/
const addDivisionFos = async (req, res) => {
  try {
    const { id } = req.params;
    const { fosCodes } = req.validatedBody;

    await linkDivisionFosService(id, fosCodes);
    res.status(200).json({
      success: true,
      message: "Division fields of study updated successfully!"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addDivisionFos,
  createDivision,
  deleteDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision
};
