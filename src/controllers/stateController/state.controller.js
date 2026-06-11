import { createState as createStateService, deleteState as deleteStateService, getAllStates as getAllStatesService, getMyStates as getMyStatesService, getSingleState as getSingleStateService, getTotalMyStates as getTotalMyStatesService, getTotalStates as getTotalStatesService, updateState as updateStateService, createMyState as createMyStateService } from '../../services/state.service.js';

/********** get all states **********/
const getAllStates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      getAllStatesService(limit, offset),
      getTotalStatesService()
    ]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No states found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "States fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit
      },
      data: rows
    });
  } catch (error) {
    console.error('Get States Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch states.'
    });
  }
};

/********** get single state **********/
const getSingleState = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }
    const state = await getSingleStateService(id);
    if (!state) {
      return res.status(404).json({ error: "State not found." });
    }
    res.status(200).json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error("Error fetching state:", error.message);
    res.status(500).json({
      success: false,
      error: "Something went wrong while fetching the state!",
    });
  }
};

/********** create state **********/
const createState = async (req, res) => {
  try {
    const result = await createStateService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "State created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create State Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create state."
    });
  }
};

/********** update state **********/
const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateStateService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "State not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "State updated successfully!",
    });
  } catch (err) {
    console.error("Error updating state:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the state.",
    });
  }
};

/********** delete state **********/
const deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteStateService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "State not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "State deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting state:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the state.",
    });
  }
};

/********** get user states (my states) **********/
const getMyStates = async (req, res) => {
  try {

    const userId = parseInt(req.user.UserID);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing userId query parameter"
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      getMyStatesService(userId, limit, offset),
      getTotalMyStatesService(userId)
    ]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No states found for this user"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User states fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit
      },
      data: rows
    });
  } catch (error) {
    console.error('Get My States Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user states.'
    });
  }
};

/********** create my state **********/
const createMyState = async (req, res) => {
  try {
    const userId = req.user.UserID;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user credentials"
      });
    }
    const result = await createMyStateService(req.validatedBody, userId);
    res.status(201).json({
      success: true,
      message: "State created and assigned to you successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create My State Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create state."
    });
  }
};

/********** update my state **********/
const updateMyState = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateStateService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "State not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "State updated successfully!",
    });
  } catch (err) {
    console.error("Error updating my state:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the state.",
    });
  }
};

/********** delete my state **********/
const deleteMyState = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteStateService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "State not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "State deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting my state:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the state.",
    });
  }
};

export { createState, deleteState, getAllStates, getMyStates, getSingleState, updateState, createMyState, updateMyState, deleteMyState };


