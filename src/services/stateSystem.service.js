import pool from '../config/db.js';

const ALLOWED_SYSTEM_FIELDS = new Set([
    "StateID", "sAgeOfEntry", "sAgeOfExit", "sSchoolSystem", "sHESystem",
    "sTrainingHETeachers", "sDistanceHE", "sNULAlternatives", "sNULAdmissionTest",
    "sNULNumerusClausus", "sNULOtherRequirements", "sULAlternatives",
    "sULAdmissionTest", "sULNumerusClausus", "sULOtherRequirements",
    "sFSDefinition", "srFSAdmissionRequirements", "sFSQuotas", "sFSHealth",
    "sFSLanguageProficiency", "sFSEntryRegulations", "sFSIndividualInst",
    "sFSCentralBody", "sRBSystemDesc", "sRBNULStudies", "sRBULStudies",
    "sRBPLStudies", "sRBProfession", "sRBOtherInfoSources", "sSSHome",
    "sSSHAmount", "sSSForeign", "sSSFAmount", "sSSFDetails", "sTCRoad",
    "sTCRail", "sTCAir", "sTCforeign", "sFNAvLivingCost", "sFNMinTuitionFee",
    "sFNMaxTuitionFee", "sFNMinTuitionFeeForeign", "sFNMaxTuitionFeeForeign",
    "sAcademicYearFrom", "sAcademicYearTo", "sSource", "sMajorUpdateDate"
]);

const ALLOWED_SCHOOL_FIELDS = new Set([
    "StateID", "sSchoolLevelCode", "sLength", "sAgeFrom", "sAgeTo", "sDiploma"
]);

const ALLOWED_DECREE_FIELDS = new Set([
    "StateID", "sDecree", "sYearDecree", "sDecreeDesc"
]);

const getStateSystems = async () => {
    const query = `
    SELECT 
        StateID as stateId,
        sAgeOfEntry as ageOfEntry,
        sAgeOfExit as ageOfExit,
        sAcademicYearFrom as academicYearFrom,
        sAcademicYearTo as academicYearTo
    FROM whed_statesystem
    ORDER BY StateID DESC
  `;
    const [rows] = await pool.query(query);
    return rows;
};

const getTotalStateSystems = async () => {
    const [result] = await pool.query('SELECT COUNT(*) as total FROM whed_statesystem');
    return result[0].total;
};

const getEducationSystemByStateIdService = async (stateId) => {

    const systemQuery = `SELECT * FROM whed_statesystem WHERE StateID = ?`;
    const [systemRows] = await pool.query(systemQuery, [stateId]);
    const system = systemRows[0];
    if (!system) return null;


    // Fetch related state type of hei
    const typeOfHeiQuery = `SELECT * FROM whed_tcsinsttype WHERE StateID = ?`;
    const [typeOfHeiRows] = await pool.query(typeOfHeiQuery, [stateId]);







    // Fetch related school levels
    const schoolQuery = `SELECT * FROM whed_tcsschool WHERE StateID = ?`;
    const [schoolRows] = await pool.query(schoolQuery, [stateId]);


    // Fetch related decrees
    const decreeQuery = `SELECT * FROM whed_tcsdecree WHERE StateID = ?`;
    const [decreeRows] = await pool.query(decreeQuery, [stateId]);


    // Fetch stages linked
    const stageQuery = `
    SELECT 
        l.StageCode as code, 
        l.Stage as name, 
        link.sStageName as customName, 
        link.sStageDescription as description
    FROM whed_tlsstatestagelink link
    JOIN whed_lex_stage l ON link.StageCode = l.StageCode
    WHERE link.StateID = ?
  `;
    const [stageRows] = await pool.query(stageQuery, [stateId]);


    // Fetch languages linked
    const languageQuery = `
    SELECT 
        l.LanguageCode as code, 
        l.Language as name, 
        link.LanguageSort as sortOrder
    FROM whed_tlsstatelanguagelink link
    JOIN whed_lex_language l ON link.LanguageCode = l.LanguageCode
    WHERE link.StateID = ?
  `;
    const [languageRows] = await pool.query(languageQuery, [stateId]);








    const responseObject = {
        StateID: system.StateID,

        TypeOfHEI: typeOfHeiRows,

        PreHigherEducationSystem: {
            ageOf: {
                entry: system.sAgeOfEntry,
                exit: system.sAgeOfExit
            },
            stuctureOfSchoolSystem: schoolRows,
            descriptionOfSchoolSystem: system.sSchoolSystem
        },

        HigherEducationSystem: {
            stucture: system.sHESystem,
            lowsAndDecrees: decreeRows,
            languageOfInstruction: languageRows,
            stagesOfHigherEducation: stageRows,
            trainingOfHigherEducationTeachers: system.sTrainingHETeachers,
            distanceHigherEducation: system.sDistanceHE,
            educationExchangePrograms: '',
        },


        Bodis: {
            governmentBodiesAndOthersOrgAccociations: {},
            bodiesReponsibleForRecognition: {},
            bodyiesResponsibleForStudentServices: {},
            studentAssociation: {},
            bodiesResponsibleForFinancialAid: {},
            bodiesResponsibleForInternationalCooperation: {},
        },

        AdmissionToHigherEducation: {

            secondarySchoolCredentialsRequiredForNonUniversityLevelAdmission: {},
            alternatives: {},
            admissionTest: {},
            numerusClauses: {},
            otherRequirements: {},
            secondarySchoolCredentialsRequiredForUniversityLevelAdmission: {},
            alternatives: {},
            admissionTest: {},
            numerusClauses: {},
            otherRequirements: {},
            foreignStudentsAdmission: {},
        },

        RecongnitionOfStudies: {
            systemOfReconignition: system.sRBSystemDesc,
            specialprovisionForRecognition: {},
            multilateralAgreements: {},
            otherInformationSources: system.sRBOtherInfoSources,
        },

        StudentLife: {
            socialSecurityOrHealthInsuranceForHomeStudents: {},
            socialSecurityOrHealthInsuranceForForeignStudents: {},
            specialtravelConcessions: {},
            studentExpensesAndAid: {
                livingCost: system.sFNAvLivingCost,
                tuitionFees: {
                    minTuitionFee: system.sFNMinTuitionFee,
                    maxTuitionFee: system.sFNMaxTuitionFee,
                    minTuitionFeeForeign: system.sFNMinTuitionFeeForeign,
                    maxTuitionFeeForeign: system.sFNMaxTuitionFeeForeign
                }
            },
            publicationsListingFinancialAid: {},

        },


        DataProvidedBy: {

            academicyear: {
                from: system.sAcademicYearFrom,
                to: system.sAcademicYearTo
            },
            source: system.sSource,
            personInchargeOfUpdate: '',
        },

        Management: {
            inputDate: system.sInputDate,
            majorUpdateDate: system.sMajorUpdateDate,
            majorUpdateDateDO: system.sMajorUpdateDateDP,
            minirUpdateDate: system.sMinorUpdateDate,
            RecordHistory: system.sRecordHistory,
            comment: system.sComment,
            bodiesUpdate: system.sBodiesUpdated,
        }
    }




    return responseObject;
};

const createStateSystem = async (systemData) => {
    const keys = Object.keys(systemData).filter(key => ALLOWED_SYSTEM_FIELDS.has(key));
    const values = keys.map(key => systemData[key]);

    if (keys.length === 0) {
        throw new Error("No valid state system fields provided");
    }

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_statesystem (${columns}) VALUES (${placeholders})`;

    await pool.query(query, values);
    return { stateId: systemData.StateID };
};

const updateStateSystem = async (stateId, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_SYSTEM_FIELDS.has(key));

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_statesystem SET ${setClause} WHERE StateID = ?`;

    const [result] = await pool.query(query, [...values, stateId]);
    return result;
};

const deleteStateSystem = async (stateId) => {
    const query = `DELETE FROM whed_statesystem WHERE StateID = ?`;
    const [result] = await pool.query(query, [stateId]);
    return result;
};

// School level CRUD
const getSchoolsByStateId = async (stateId) => {
    const query = `SELECT * FROM whed_tcsschool WHERE StateID = ?`;
    const [rows] = await pool.query(query, [stateId]);
    return rows;
};

const createSchool = async (schoolData) => {
    const keys = Object.keys(schoolData).filter(key => ALLOWED_SCHOOL_FIELDS.has(key));
    const values = keys.map(key => schoolData[key]);

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_tcsschool (${columns}) VALUES (${placeholders})`;

    await pool.query(query, values);
    return schoolData;
};

const updateSchool = async (stateId, schoolLevelCode, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_SCHOOL_FIELDS.has(key));
    if (keys.length === 0) return { affectedRows: 0 };

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_tcsschool SET ${setClause} WHERE StateID = ? AND sSchoolLevelCode = ?`;

    const [result] = await pool.query(query, [...values, stateId, schoolLevelCode]);
    return result;
};

const deleteSchool = async (stateId, schoolLevelCode) => {
    const query = `DELETE FROM whed_tcsschool WHERE StateID = ? AND sSchoolLevelCode = ?`;
    const [result] = await pool.query(query, [stateId, schoolLevelCode]);
    return result;
};

// Decree CRUD
const getDecreesByStateId = async (stateId) => {
    const query = `SELECT * FROM whed_tcsdecree WHERE StateID = ?`;
    const [rows] = await pool.query(query, [stateId]);
    return rows;
};

const createDecree = async (decreeData) => {
    const keys = Object.keys(decreeData).filter(key => ALLOWED_DECREE_FIELDS.has(key));
    const values = keys.map(key => decreeData[key]);

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_tcsdecree (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);
    return { id: result.insertId };
};

const updateDecree = async (decreeId, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_DECREE_FIELDS.has(key));
    if (keys.length === 0) return { affectedRows: 0 };

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_tcsdecree SET ${setClause} WHERE DecreeID = ?`;

    const [result] = await pool.query(query, [...values, decreeId]);
    return result;
};

const deleteDecree = async (decreeId) => {
    const query = `DELETE FROM whed_tcsdecree WHERE DecreeID = ?`;
    const [result] = await pool.query(query, [decreeId]);
    return result;
};

export {
    createDecree,
    createSchool,
    createStateSystem,
    deleteDecree,
    deleteSchool,
    deleteStateSystem,
    getDecreesByStateId, getEducationSystemByStateIdService, getSchoolsByStateId,
    getStateSystems,
    getTotalStateSystems,
    updateDecree,
    updateSchool,
    updateStateSystem
};

