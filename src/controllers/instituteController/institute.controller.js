import { createInstitute as createInstituteService, deleteInstitute as deleteInstituteService, getAllInstitutes as getAllInstitutesService, getSingleInstitute as getSingleInstituteService, getDetailedInstitutesByState as getDetailedInstitutesByStateService, updateInstitute as updateInstituteService } from '../../services/institute.service.js';

/********** get all institutes **********/
const getAllInstitutes = async (req, res) => {
  try {
    const filters = {
      stateId: req.query.stateId ? parseInt(req.query.stateId) : null,
      countryCode: req.query.countryCode || null,
      fundingType: req.query.fundingType || null,
      search: req.query.search || null
    };

    const rows = await getAllInstitutesService(filters);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No institutions found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Institutes fetched successfully",
      data: rows
    });
  } catch (error) {
    console.error('Get Institutions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch institutions.'
    });
  }
};

/********** get single institute **********/
const getSingleInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }
    const institute = await getSingleInstituteService(id);
    if (!institute) {
      return res.status(404).json({ error: "Institute not found." });
    }
    res.status(200).json({
      success: true,
      data: institute,
    });
  } catch (error) {
    console.error("Error fetching institute:", error.message);
    res.status(500).json({
      success: false,
      error: "Something went wrong while fetching the institute!",
    });
  }
};

/********** create institute **********/
const createInstitute = async (req, res) => {
  try {
    const result = await createInstituteService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "Institution created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Transaction Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create institution. Database rolled back."
    });
  }
};

/********** update institute **********/
const updateInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateInstituteService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Institute not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Institute updated successfully!",
    });
  } catch (err) {
    console.error("Error updating institute:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the institute.",
    });
  }
};

/********** delete institute **********/
const deleteInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteInstituteService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Institute not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Institute deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting institute:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the institute.",
    });
  }
};

/********** get institutes by state **********/
const getInstitutesByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({ success: false, message: "Invalid state ID format." });
    }

    const filters = {
      stateId: parseInt(stateId),
      countryCode: req.query.countryCode || null,
      fundingType: req.query.fundingType || null,
      search: req.query.search || null
    };

    const rows = await getDetailedInstitutesByStateService(parseInt(stateId), filters);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No institutions found for State ID ${stateId}`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Institutes fetched successfully",
      data: rows
    });
  } catch (error) {
    console.error('Get Institutes by State Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch institutions for the specified state.'
    });
  }
};

export { createInstitute, deleteInstitute, getAllInstitutes, getSingleInstitute, getInstitutesByState, updateInstitute };
