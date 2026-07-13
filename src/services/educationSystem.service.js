import pool from '../config/db.js';

const ALLOWED_SYSTEM_FIELDS = new Set([
    "sAcademicYearFrom",
    "sAcademicYearTo",
    "sAgeOfEntry",
    "sAgeOfExit",
    "sSchoolSystem",
    "sHESystem",
    "sSource",
    "sInCharge",
    "sNULAlternatives",
    "sNULAdmissionTest",
    "sNULOtherRequirements",
    "sNULNumerusClausus",
    "sULAlternatives",
    "sULAdmissionTest",
    "sULOtherRequirements",
    "sULNumerusClausus",
    "sFSDefinition",
    "sFSQuotas",
    "srFSAdmissionRequirements",
    "sFSEntryRegulations",
    "sFSHealth",
    "sFSLanguageProficiency",
    "sFSIndividualInst",
    "sFSCentralBody",
    "sRBSystemDesc",
    "sRBOtherInfoSources",
    "sRBNULStudies",
    "sRBULStudies",
    "sRBPLStudies",
    "sRBProfession",
    "sSSHome",
    "sSSHAmount",
    "sSSHCurrencyCode",
    "sSSForeign",
    "sSSFAmount",
    "sSSFCurrencyCode",
    "sSSFDetails",
    "sTCRoad",
    "sTCRail",
    "sTCAir",
    "sTCforeign",
    "sFNAvLivingCost",
    "sFNALCCurrencyCode",
    "sFNMinTuitionFee",
    "sFNMTFCCurrencyCode",
    "sFNMaxTuitionFee",
    "sFNMxTFCCurrencyCode",
    "sFNMinTuitionFeeForeign",
    "sFNMTFCfCurrencyCode",
    "sFNMaxTuitionFeeForeign",
    "sFNMxTFCfCurrencyCode",
    "sTrainingHETeachers",
    "sDistanceHE",
    "sComment"
]);

const ALLOWED_SCHOOL_FIELDS = new Set([
    "sSchool", "sSchoolLevelCode", "sLength", "sAgeFrom", "sAgeTo", "sDiploma"
]);

const ALLOWED_DECREE_FIELDS = new Set([
    "StateID", "sDecree", "sYearDecree", "sDecreeDesc"
]);

const ALLOWED_TYPE_OF_HEIS_FIELDS = new Set([
    "sInstType", "sInstTypeEnglish", "sInstTypeDescription"
])


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

            secondarySchoolCredentialsRequiredForNonUniversityLevelAdmission: [],
            nualternatives: system.sNULAlternatives,
            nuadmissionTest: system.sNULAdmissionTest,
            nunumerusClauses: system.sNULNumerusClausus,
            nuotherRequirements: system.sNULOtherRequirements,

            secondarySchoolCredentialsRequiredForUniversityLevelAdmission: [],
            ualternatives: system.sULAlternatives,
            uadmissionTest: system.sULAdmissionTest,
            unumerusClauses: system.sULNumerusClausus,
            uotherRequirements: system.sULOtherRequirements,

            foreignStudentsAdmission: {
                defination: system.sFSDefinition,
                admissionRequirements: system.srFSAdmissionRequirements,
                quotas: system.sFSQuotas,
                health: system.sFSHealth,
                languageProficiency: system.sFSLanguageProficiency,
                entryRequlation: system.sFSEntryRegulations,
                applicationIndividualInst: system.sFSIndividualInst,
                applicationToCentralBody: system.sFSCentralBody,
            },
        },

        RecongnitionOfStudies: {
            systemOfReconignition: system.sRBSystemDesc,
            specialprovisionForRecognition: {},
            multilateralAgreements: {},
            otherInformationSources: system.sRBOtherInfoSources,
        },

        StudentLife: {
            socialSecurityOrHealthInsuranceForHomeStudents: {
                isThereSocialSecurity: system.sSSHome,
                costPerYear: system.sSSHAmount,
                currency: system.sSSHCurrencyCode
            },
            socialSecurityOrHealthInsuranceForForeignStudents: {
                isThereSocialSecurity: system.sSSForeign,
                costPerYear: system.sSSFAmount,
                currency: system.sSSFCurrencyCode,
                detailes: system.sSSFDetails
            },
            specialtravelConcessions: {
                byRoad: system.sTCRoad,
                byAir: system.sTCAir,
                byRail: system.sTCRail,
                availableToForeignStudent: system.sTCforeign
            },
            studentExpensesAndAid: {
                livingCost: system.sFNAvLivingCost,
                livingCostCurrency: system.sFNALCCurrencyCode,
                tuitionFees: {
                    minTuitionFeeForNationStudent: system.sFNMinTuitionFee,
                    minTuitionFeeCurrencyForNationStudent: system.sFNMTFCCurrencyCode,
                    maxTuitionFeeForNationStudent: system.sFNMaxTuitionFee,
                    maxTuitionFeeCurrencyForNationStudent: system.sFNMxTFCCurrencyCode,
                    minTuitionFeeForForeignStudent: system.sFNMinTuitionFeeForeign,
                    minTuitionFeeCurrencyForForeignStudent: system.sFNMTFCfCurrencyCode,
                    maxTuitionFeeForForeignStudent: system.sFNMaxTuitionFeeForeign,
                    maxTuitionFeeCurrencyForForeignStudent: system.sFNMxTFCfCurrencyCode
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
            comment: system.sComment,
            bodiesUpdate: system.sBodiesUpdated,
            personInchargeOfUpdate: system.sInCharge,
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
    const mapData = {
        sAcademicYearFrom: updateData.sAcademicYearFrom,
        sAcademicYearTo: updateData.sAcademicYearTo,

        sAgeOfEntry: updateData.sAgeOfEntry,
        sAgeOfExit: updateData.sAgeOfExit,

        sSchoolSystem: updateData.sSchoolSystem,
        sHESystem: updateData.sHESystem,
        sSource: updateData.sSource,
        sInCharge: updateData.sInCharge,
        sNULAlternatives: updateData.sNULAlternatives,
        sNULAdmissionTest: updateData.sNULAdmissionTest,
        sNULOtherRequirements: updateData.sNULOtherRequirements,
        sNULNumerusClausus: updateData.sNULNumerusClausus,

        sULAlternatives: updateData.sULAlternatives,
        sULAdmissionTest: updateData.sULAdmissionTest,
        sULOtherRequirements: updateData.sULOtherRequirements,
        sULNumerusClausus: updateData.sULNumerusClausus,

        sFSDefinition: updateData.sFSDefinition,
        sFSQuotas: updateData.sFSQuotas,
        srFSAdmissionRequirements: updateData.srFSAdmissionRequirements,
        sFSEntryRegulations: updateData.sFSEntryRegulations,
        sFSHealth: updateData.sFSHealth,
        sFSLanguageProficiency: updateData.sFSLanguageProficiency,

        sFSIndividualInst: updateData.sFSIndividualInst,
        sFSCentralBody: updateData.sFSCentralBody,

        sRBSystemDesc: updateData.sRBSystemDesc,
        sRBOtherInfoSources: updateData.sRBOtherInfoSources,
        sRBNULStudies: updateData.sRBNULStudies,
        sRBULStudies: updateData.sRBULStudies,
        sRBPLStudies: updateData.sRBPLStudies,
        sRBProfession: updateData.sRBProfession,

        sSSHome: updateData.sSSHome,
        sSSHAmount: updateData.sSSHAmount,
        sSSHCurrencyCode: updateData.sSSHCurrencyCode,

        sSSForeign: updateData.sSSForeign,
        sSSFAmount: updateData.sSSFAmount,
        sSSFCurrencyCode: updateData.sSSFCurrencyCode,
        sSSFDetails: updateData.sSSFDetails,

        sTCRoad: updateData.sTCRoad,
        sTCRail: updateData.sTCRail,
        sTCAir: updateData.sTCAir,
        sTCforeign: updateData.sTCforeign,

        sFNAvLivingCost: updateData.sFNAvLivingCost,
        sFNALCCurrencyCode: updateData.sFNALCCurrencyCode,

        sFNMinTuitionFee: updateData.sFNMinTuitionFee,
        sFNMTFCCurrencyCode: updateData.sFNMTFCCurrencyCode,

        sFNMaxTuitionFee: updateData.sFNMaxTuitionFee,
        sFNMxTFCCurrencyCode: updateData.sFNMxTFCCurrencyCode,

        sFNMinTuitionFeeForeign: updateData.sFNMinTuitionFeeForeign,
        sFNMTFCfCurrencyCode: updateData.sFNMTFCfCurrencyCode,

        sFNMaxTuitionFeeForeign: updateData.sFNMaxTuitionFeeForeign,
        sFNMxTFCfCurrencyCode: updateData.sFNMxTFCfCurrencyCode,

        sTrainingHETeachers: updateData.sTrainingHETeachers,
        sDistanceHE: updateData.sDistanceHE,

        sComment: updateData.sComment,

        sRecordHistory: "",
    };

    // শুধু undefined field-গুলো বাদ দিবে।
    // null থাকলে update হবে।
    const filteredData = Object.fromEntries(
        Object.entries(mapData).filter(([_, value]) => value !== undefined)
    );

    const keys = Object.keys(filteredData);

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map((key) => filteredData[key]);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query = `
        UPDATE whed_statesystem
        SET ${setClause}
        WHERE StateID = ?
    `;

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

const createSchool = async (stateId, schoolData) => {


    const mapData = {
        StateID: stateId,
        sSchool: schoolData.sSchool,
        sSchoolLevelCode: schoolData.sSchoolLevelCode,
        sLength: schoolData.sLength,
        sAgeFrom: schoolData.sAgeFrom,
        sAgeTo: schoolData.sAgeTo,
        sDiploma: schoolData.sDiploma,
    };


    const query = `
        INSERT INTO whed_tcsschool (
            StateID,
            sSchool,
            sSchoolLevelCode,
            sLength,
            sAgeFrom,
            sAgeTo,
            sDiploma
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        mapData.StateID,
        mapData.sSchool,
        mapData.sSchoolLevelCode,
        mapData.sLength,
        mapData.sAgeFrom,
        mapData.sAgeTo,
        mapData.sDiploma
    ];

    const [result] = await pool.query(query, values);

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
    };
};

const updateSchool = async (stateId, schoolId, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_SCHOOL_FIELDS.has(key));
    if (keys.length === 0) return { affectedRows: 0 };

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_tcsschool SET ${setClause} WHERE StateID = ? AND sSchoolID = ?`;

    const [result] = await pool.query(query, [...values, stateId, schoolId]);
    return result;
};

const deleteSchool = async (stateId, schoolId) => {
    const query = `DELETE FROM whed_tcsschool WHERE StateID = ? AND sSchoolID = ?`;
    const [result] = await pool.query(query, [stateId, schoolId]);
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




const createTypeOfHeisService = async (stateId, InsData) => {

    const mapData = {
        StateID: stateId,
        sInstType: InsData.sInstType,
        sInstTypeEnglish: InsData.sInstTypeEnglish,
        sInstTypeDescription: InsData.sInstTypeDescription,
    };

    const query = `
        INSERT INTO whed_tcsinsttype (
            StateID,
            sInstType,
            sInstTypeEnglish,
            sInstTypeDescription
        )
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        mapData.StateID,
        mapData.sInstType,
        mapData.sInstTypeEnglish,
        mapData.sInstTypeDescription,
    ];

    const [result] = await pool.query(query, values);

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
    };


};


const updateTypeOfHeisService = async (stateId, id, updateData) => {
    const keys = Object.keys(updateData).filter(key =>
        ALLOWED_TYPE_OF_HEIS_FIELDS.has(key)
    );

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);

    const setClause = keys.map(key => `${key} = ?`).join(", ");

    const query = `
        UPDATE whed_tcsinsttype
        SET ${setClause}
        WHERE StateID = ? AND sInstTypeID = ?
    `;

    const [result] = await pool.query(query, [
        ...values,
        stateId,
        id,
    ]);

    return result;
}



const deleteTypeOfHeisService = async (stateId, id) => {

    const query = `DELETE FROM whed_tcsinsttype WHERE StateID = ? AND sInstTypeID = ?`;
    const [result] = await pool.query(query, [stateId, id]);
    return result;
};





export {
    createDecree,
    createSchool,
    createStateSystem, createTypeOfHeisService, deleteDecree,
    deleteSchool,
    deleteStateSystem, deleteTypeOfHeisService, getDecreesByStateId, getEducationSystemByStateIdService, getSchoolsByStateId,
    getStateSystems,
    getTotalStateSystems,
    updateDecree,
    updateSchool,
    updateStateSystem,
    updateTypeOfHeisService
};

