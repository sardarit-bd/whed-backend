import {
  assignCountry as assignCountryService,
  assignInstitution as assignInstitutionService,
  getCountryAssignments as getCountryAssignmentsService,
  getInstitutionAssignments as getInstitutionAssignmentsService,
  removeCountryAssignment as removeCountryAssignmentService,
  removeInstitutionAssignment as removeInstitutionAssignmentService
} from "../../services/assignment.service.js";

/********** country assignments **********/
const getCountryAssignmentsController = async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId) : null;
    const data = await getCountryAssignmentsService(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignCountryController = async (req, res) => {
  try {
    const result = await assignCountryService(req.validatedBody);
    res.status(201).json({ success: true, message: "Country control assigned successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeCountryAssignmentController = async (req, res) => {
  try {
    const { userId, stateId } = req.query;
    if (!userId || !stateId) {
      return res.status(400).json({ success: false, message: "userId and stateId parameters are required" });
    }
    await removeCountryAssignmentService(parseInt(userId), parseInt(stateId));
    res.status(200).json({ success: true, message: "Country control removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/********** institution assignments **********/
const getInstitutionAssignmentsController = async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId) : null;
    const data = await getInstitutionAssignmentsService(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignInstitutionController = async (req, res) => {
  try {
    const result = await assignInstitutionService(req.validatedBody);
    res.status(201).json({ success: true, message: "Institution control assigned successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeInstitutionAssignmentController = async (req, res) => {
  try {
    const { userId, stateId } = req.query;
    if (!userId || !stateId) {
      return res.status(400).json({ success: false, message: "userId and stateId parameters are required" });
    }
    await removeInstitutionAssignmentService(parseInt(userId), parseInt(stateId));
    res.status(200).json({ success: true, message: "Institution control removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  assignCountryController,
  assignInstitutionController,
  getCountryAssignmentsController,
  getInstitutionAssignmentsController,
  removeCountryAssignmentController,
  removeInstitutionAssignmentController
};
