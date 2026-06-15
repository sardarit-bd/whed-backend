import {
  createFieldOfStudy as createFieldOfStudyService,
  createInstType as createInstTypeService,
  createLanguage as createLanguageService,
  createStage as createStageService,
  deleteInstType as deleteInstTypeService,
  getFieldsOfStudy as getFieldsOfStudyService,
  getInstTypeById as getInstTypeByIdService,
  getInstTypes as getInstTypesService,
  getLanguages as getLanguagesService,
  getStages as getStagesService,
  linkStateLanguage as linkStateLanguageService,
  linkStateStage as linkStateStageService,
  updateInstType as updateInstTypeService
} from "../../services/lookup.service.js";

/********** get all institution types **********/
const getInstTypesController = async (req, res) => {
  try {
    const stateId = req.query.stateId ? parseInt(req.query.stateId) : null;

    const rows = await getInstTypesService(stateId);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: "No institution types found" });
    }

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInstTypeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getInstTypeByIdService(id);
    if (!data) return res.status(404).json({ success: false, message: "Institution type not found" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createInstTypeController = async (req, res) => {
  try {
    const result = await createInstTypeService(req.validatedBody);
    res.status(201).json({ success: true, message: "Institution type created!", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInstTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    await updateInstTypeService(id, req.validatedBody);
    res.status(200).json({ success: true, message: "Institution type updated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteInstTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteInstTypeService(id);
    res.status(200).json({ success: true, message: "Institution type deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Languages
const getLanguagesController = async (req, res) => {
  try {
    const data = await getLanguagesService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createLanguageController = async (req, res) => {
  try {
    const result = await createLanguageService(req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const linkStateLanguageController = async (req, res) => {
  try {
    const { stateId } = req.params;
    const result = await linkStateLanguageService(stateId, req.validatedBody);
    res.status(200).json({ success: true, message: "Language linked to country successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stages
const getStagesController = async (req, res) => {
  try {
    const data = await getStagesService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createStageController = async (req, res) => {
  try {
    const result = await createStageService(req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const linkStateStageController = async (req, res) => {
  try {
    const { stateId } = req.params;
    const result = await linkStateStageService(stateId, req.validatedBody);
    res.status(200).json({ success: true, message: "Stage linked to country successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fields of Study
const getFieldsOfStudyController = async (req, res) => {
  try {
    const data = await getFieldsOfStudyService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFieldOfStudyController = async (req, res) => {
  try {
    const result = await createFieldOfStudyService(req.validatedBody);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createFieldOfStudyController,
  createInstTypeController,
  createLanguageController,
  createStageController,
  deleteInstTypeController,
  getFieldsOfStudyController,
  getInstTypeByIdController,
  getInstTypesController,
  getLanguagesController,
  getStagesController,
  linkStateLanguageController,
  linkStateStageController,
  updateInstTypeController
};
