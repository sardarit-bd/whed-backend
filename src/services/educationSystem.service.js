import pool from '../config/db.js';

const ALLOWED_SYSTEM_FIELDS = new Set([
    "sAcademicYearFrom",
    "sAcademicYearTo",
    "sAgeOfEntry",
    "sAgeOfExit",
    "sSchoolSystem",
    "sHESystem",
    "sTrainingHETeachers",
    "sDistanceHE",
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
    "sDecree", "sYearDecree", "sDecreeDesc"
]);

const ALLOWED_TYPE_OF_HEIS_FIELDS = new Set([
    "sInstType", "sInstTypeEnglish", "sInstTypeDescription"
])


const ALLOWED_STAGE_FIELDS = new Set([
    "StageCode", "sStageName", "sStageDescription"
])

const ALLOWED_AGREEMENT_FIELDS = new Set([
    "sAgreement", "sAgreementYear"
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



    const agreementQuery = `SELECT * FROM whed_tcsagreement WHERE StateID = ?`;
    const [agreementRows] = await pool.query(agreementQuery, [stateId]);
    const agreement = agreementRows;


    const exchangeProgramQuery = `SELECT * FROM whed_tcsexchangeprogram WHERE StateID = ?`;
    const [exchangeProgramRows] = await pool.query(exchangeProgramQuery, [stateId]);
    const exchangeProgram = exchangeProgramRows;




    const bodiesQuery = `
    SELECT *
    FROM whed_org
    WHERE StateID = ?
    AND OrgTypeCode != 'IN'
`;

    const [bodies] = await pool.query(bodiesQuery, [stateId]);

    const supplementaryTableMap = {
        FB: "whed_orgfinaidbody",
        GB: "whed_orggovbody",
        GP: "whed_orggovbody",
        CB: "whed_orgintcoop",
        RB: "whed_orgrecbody",
        RP: "whed_orgrecbody",
        SA: "whed_orgstudentassoc",
        SS: "whed_orgstudentservice",
    };

    if (!bodies.length) {
        return {
            GB: [],
            GP: [],
            FB: [],
            CB: [],
            RB: [],
            RP: [],
            SA: [],
            SS: [],
        };
    }

    const orgIds = bodies.map(body => body.OrgID);

    /**
     * Get all contacts
     */
    const [contacts] = await pool.query(
        `SELECT * FROM whed_contact WHERE OrgID IN (?)`,
        [orgIds]
    );

    /**
     * Contact Map
     * {
     *   1: [{...}, {...}],
     *   2: [{...}]
     * }
     */
    const contactMap = {};

    for (const contact of contacts) {
        if (!contactMap[contact.OrgID]) {
            contactMap[contact.OrgID] = [];
        }

        contactMap[contact.OrgID].push(contact);
    }

    /**
     * Group OrgIDs by OrgTypeCode
     * {
     *   FB: [1,2],
     *   GB: [3,4]
     * }
     */
    const groupedByType = {};

    for (const body of bodies) {
        if (!groupedByType[body.OrgTypeCode]) {
            groupedByType[body.OrgTypeCode] = [];
        }

        groupedByType[body.OrgTypeCode].push(body.OrgID);
    }

    /**
     * Supplementary Map
     * {
     *   1: {...},
     *   2: {...}
     * }
     */
    const supplementaryMap = {};

    for (const [orgTypeCode, ids] of Object.entries(groupedByType)) {
        const tableName = supplementaryTableMap[orgTypeCode];

        if (!tableName) continue;

        const [rows] = await pool.query(
            `SELECT * FROM ${tableName} WHERE OrgID IN (?)`,
            [ids]
        );

        for (const row of rows) {
            supplementaryMap[row.OrgID] = row;
        }
    }

    /**
     * Final Grouped Result
     * {
     *   GB: [...],
     *   FB: [...]
     * }
     */
    const groupedBodies = {
        GB: [],
        GP: [],
        FB: [],
        CB: [],
        RB: [],
        RP: [],
        SA: [],
        SS: [],
    };

    for (const body of bodies) {
        const orgTypeCode = body.OrgTypeCode;

        const item = {
            genaralInfo: body,
            supplementary: supplementaryMap[body.OrgID] || {},
            contactInfo: contactMap[body.OrgID] || [],
        };

        if (!groupedBodies[orgTypeCode]) {
            groupedBodies[orgTypeCode] = [];
        }

        groupedBodies[orgTypeCode].push(item);
    }


    const resReady = [
        {
            id: "govBody",
            Title: "Governing bodies and other organizations / associations",
            button: "Add Governing Body",
            data: [...groupedBodies.GB, ...groupedBodies.GP]
        },
        {
            id: "recognitionBody",
            Title: "Bodies responsible for recognition",
            button: "Add Recognition Body",
            data: [...groupedBodies.RB, ...groupedBodies.RP]
        },
        {
            id: "studentServicesBody",
            Title: "Bodies responsible for Student Srvices",
            button: "Add Student Services Body",
            data: [...groupedBodies.SS]
        },
        {
            id: "studentAccociationBody",
            Title: "Bodies responsible for Student Accociation",
            button: "Add Student Accocition Body",
            data: [...groupedBodies.SA]
        },
        {
            id: "financialAidBody",
            Title: "Bodies responsible for Financial Aid",
            button: "Add Financial Aid Body",
            data: [...groupedBodies.FB]
        },
        {
            id: "internationalCooperationBody",
            Title: "Bodies responsible for International Cooperation",
            button: "Add International Cooperation Body",
            data: [...groupedBodies.CB]
        },
    ]





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
            stagesOfHigherEducation: stageRows?.sort((a, b) => Number(a.code.slice(1)) - Number(b.code.slice(1))),
            trainingOfHigherEducationTeachers: system.sTrainingHETeachers,
            distanceHigherEducation: system.sDistanceHE,
            educationExchangePrograms: exchangeProgram,
        },


        Bodis: resReady,

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
            sRBNULStudies: system?.sRBNULStudies,
            sRBULStudies: system?.sRBULStudies,
            sRBPLStudies: system?.sRBPLStudies,
            sRBProfession: system?.sRBProfession,
            multilateralAgreements: agreement,
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

const createDecree = async (stateID, decreeData) => {

    const mapData = {
        StateID: stateID,
        sDecree: decreeData.sDecree,
        sYearDecree: decreeData.sYearDecree,
        sDecreeDesc: decreeData.sDecreeDesc,
    };

    const query = `
        INSERT INTO whed_tcsdecree (
            StateID,   
            sDecree,
            sYearDecree,
            sDecreeDesc
        )
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        mapData.StateID,
        mapData.sDecree,
        mapData.sYearDecree,
        mapData.sDecreeDesc,
    ];

    const [result] = await pool.query(query, values);

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
    };
};

const updateDecree = async (stateId, decreeID, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_DECREE_FIELDS.has(key));
    if (keys.length === 0) return { affectedRows: 0 };

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_tcsdecree SET ${setClause} WHERE sDecreeID = ? AND StateID = ?`;

    const [result] = await pool.query(query, [...values, decreeID, stateId]);
    return result;
};

const deleteDecree = async (stateId, decreeId) => {
    const query = `DELETE FROM whed_tcsdecree WHERE sDecreeID = ? AND StateID = ?`;
    const [result] = await pool.query(query, [decreeId, stateId]);
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



const getAgreementByStateIDService = async (stateId) => {
    const agreementQuery = `SELECT * FROM whed_tcsagreement WHERE StateID = ?`;
    const [agreementRows] = await pool.query(agreementQuery, [stateId]);
    const agreement = agreementRows;
    if (!agreement) return null;
    return agreement;
}


const createAgreementService = async (stateId, agreementData) => {

    const mapData = {
        StateID: stateId,
        sAgreement: agreementData.sAgreement,
        sAgreementYear: agreementData.sAgreementYear
    };


    const query = `
        INSERT INTO whed_tcsagreement (
            StateID,
            sAgreement,
            sAgreementYear
        )
        VALUES (?, ?, ?)
    `;

    const values = [
        mapData.StateID,
        mapData.sAgreement,
        mapData.sAgreementYear
    ];

    const [result] = await pool.query(query, values);

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
    };
};


const deleteAgreement = async (stateId, agreementId) => {
    const query = `DELETE FROM whed_tcsagreement WHERE StateID = ? AND sAgreementID = ?`;
    const [result] = await pool.query(query, [stateId, agreementId]);
    return result;
};



const createLanguageService = async (stateId, languageData) => {

    const mapData = {
        StateID: stateId,
        LanguageCode: languageData.LanguageCode
    };


    const query = `
        INSERT INTO whed_tlsstatelanguagelink (
            StateID,
            LanguageCode
        )
        VALUES (?, ?)
    `;

    const values = [
        mapData.StateID,
        mapData.LanguageCode
    ];

    const [result] = await pool.query(query, values);

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
    };
};



const deleteLanguage = async (stateId, languageCode) => {
    const query = `DELETE FROM whed_tlsstatelanguagelink WHERE StateID = ? AND LanguageCode = ?`;
    const [result] = await pool.query(query, [stateId, languageCode]);
    return result;
};



const createStageService = async (stateId, stageData) => {

    const mapData = {
        StateID: stateId,
        StageCode: stageData.StageCode,
        sStageName: stageData.sStageName,
        sStageDescription: stageData.sStageDescription,
    };



    const query = `
        INSERT INTO whed_tlsstatestagelink (
            StateID,
            StageCode,
            sStageName,
            sStageDescription
        )
        VALUES (?, ?, ?,?)
    `;

    const values = [
        mapData.StateID,
        mapData.StageCode,
        mapData.sStageName,
        mapData.sStageDescription
    ];

    const [result] = await pool.query(query, values);

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
    };
};


const updateStageServices = async (stateId, stageCode, updateData) => {

    const keys = Object.keys(updateData).filter(key => ALLOWED_STAGE_FIELDS.has(key));
    if (keys.length === 0) return { affectedRows: 0 };

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_tlsstatestagelink SET ${setClause} WHERE StageCode = ? AND StateID = ?`;

    const [result] = await pool.query(query, [...values, stageCode, stateId]);
    return result;

};



const deleteStage = async (stateId, stageCode) => {
    const query = `DELETE FROM whed_tlsstatestagelink WHERE StateID = ? AND StageCode = ?`;
    const [result] = await pool.query(query, [stateId, stageCode]);
    return result;
};


const createExchangeprogramService = async (stateId, exchangeprogramData) => {

    const mapData = {
        StateID: stateId,
        sExchangeProgram: exchangeprogramData.sExchangeProgram
    };



    const query = `
        INSERT INTO whed_tcsexchangeprogram (
            StateID,
            sExchangeProgram
        )
        VALUES (?, ?)
    `;

    const values = [
        mapData.StateID,
        mapData.sExchangeProgram
    ];

    const [result] = await pool.query(query, values);

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
    };
};



const deleteExchangeprogram = async (stateId, exchangeId) => {
    const query = `DELETE FROM whed_tcsexchangeprogram WHERE StateID = ? AND sExchangeProgramID = ?`;
    const [result] = await pool.query(query, [stateId, exchangeId]);
    return result;
};





const createBodiesService = async (stateId, instituteData, user) => {

    //  get all state Information by stateID Frist
    const query = `
    SELECT 
        StateID as id,
        Country as country,
        State as state,
        CountryCode as countryCode,
        StateCode as stateCode,
        StateAlpha as stateAlpha,
        ProxyStateID as proxyStateId,
        Palgrave as palgrave,
        UseCountryCreds as useCountryCreds,
        EdSysLocked as edSysLocked,
        InstLocked as instLocked,
        Stub as stub,
        CredLocked as credLocked,
        Regions as regions,
        ISO3 as iso3
    FROM whed_state
    WHERE StateID = ?
  `;
    const [rows] = await pool.query(query, [stateId]);
    const stateInfo = rows[0];


    const mappedData = {};


    mappedData.UserID = user ? user.UserID : null;
    mappedData.OrgName = instituteData.OrgName ? instituteData.OrgName.trim() : '';
    mappedData.InstNameEnglish = instituteData.InstNameEnglish ? instituteData.InstNameEnglish.trim() : '';
    mappedData.iBranchName = instituteData.branchof ? instituteData.branchof.trim() : '';
    mappedData.iBranchNameEnglish = instituteData.branchof ? instituteData.branchof.trim() : '';
    mappedData.iRecordHistory = instituteData.recordHistory ? instituteData.recordHistory.trim() : '';
    mappedData.iInstClassHistory = instituteData.iInstClassHistory ? instituteData.iInstClassHistory.trim() : '';


    if (instituteData.GlobalID) mappedData.GlobalID = instituteData.GlobalID.trim();
    if (stateInfo) mappedData.StateID = parseInt(stateInfo?.id, 10);
    if (stateInfo) mappedData.CountryCode = stateInfo?.countryCode;
    if (stateInfo) mappedData.StateCode = stateInfo?.stateCode;

    if (instituteData.OrgTypeCode) mappedData.OrgTypeCode = instituteData.OrgTypeCode.trim();
    if (instituteData.acronym) mappedData.InstAcronym = instituteData.acronym.trim();


    if (instituteData.street) mappedData.Street = instituteData.street.trim();
    if (instituteData.city) mappedData.City = instituteData.city.trim();
    if (instituteData.province) mappedData.Province = instituteData.province.trim();
    if (instituteData.postalCode) mappedData.PostCode = instituteData.postalCode.trim();
    if (instituteData.tel) mappedData.Tel = instituteData.tel.trim();
    if (instituteData.fax) mappedData.Fax = instituteData.fax.trim();
    if (instituteData.email) mappedData.EMail = instituteData.email.trim();
    if (instituteData.website) mappedData.WWW = instituteData.website.trim();
    if (instituteData.logo) mappedData.iLogo = instituteData.logo.trim();
    mappedData.iInputDate = new Date();
    mappedData.iWebUpdateDate = new Date();



    // ==========================================
    // ১১. ডাটাবেজ ট্রানজেকশন এক্সিকিউশন
    // ==========================================
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const keys = Object.keys(mappedData);
        const values = Object.values(mappedData);

        if (keys.length === 0) {
            throw new Error("No valid fields provided for database insertion.");
        }

        const placeholders = keys.map(() => "?").join(", ");
        const columns = keys.join(", ");
        const query = `INSERT INTO whed_org (${columns}) VALUES (${placeholders})`;

        const [result] = await connection.query(query, values);

        const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;

        const globalId = `IAU-${String(insertId).padStart(6, "0")}`;

        await connection.query(
            `UPDATE whed_org
                SET GlobalID = ?
                WHERE OrgID = ?`,
            [globalId, insertId]
        );




        // OrgTypeCode -> Table Mapping
        const supplementaryDataForGOVBody = {
            OrgID: insertId,
            GovBodyRole: instituteData.Role ?? null,
            GovBodyAcademic: instituteData.Academic ?? null,
            GovBodyInternational: instituteData.International ?? null,
            GovBodyIAUMembership: instituteData.IAUMembership ?? null,
        };
        const supplementaryDataForFinancialAID = {
            OrgID: insertId,
            faRole: instituteData.Role ?? null,
            faAcademic: instituteData.Academic ?? null,
            faInternational: instituteData.International ?? null,
            faIAUMembership: instituteData.IAUMembership ?? null,
            FaGrants: instituteData.FaGrants ?? null,
            FaLoans: instituteData.FaLoans ?? null,
            FaStudentCat: instituteData.FaStudentCat ?? null,

        };
        const supplementaryDataForCOOP = {
            OrgID: insertId,
            icRole: instituteData.Role ?? null,
            icAcademic: instituteData.Academic ?? null,
            icInternational: instituteData.International ?? null,
            icIAUMembership: instituteData.IAUMembership ?? null,
        };
        const supplementaryDataForRecognition = {
            OrgID: insertId,
            rbRole: instituteData.Role ?? null,
            rbAcademic: instituteData.Academic ?? null,
            rbInternational: instituteData.International ?? null,
            rbIAUMembership: instituteData.IAUMembership ?? null,
            rbForeignCredInstitution: instituteData.rbForeignCredInstitution ?? null,
            rbForeignCredProfession: instituteData.rbForeignCredProfession ?? null,
            rbRecServices: instituteData.rbRecServices ?? null,
        };
        const supplementaryDataForStudentAssociation = {
            OrgID: insertId,
            saRole: instituteData.Role ?? null,
            saAcademic: instituteData.Academic ?? null,
            saInternational: instituteData.International ?? null,
            saIAUMembership: instituteData.IAUMembership ?? null,
        };
        const supplementaryDataForStudentService = {
            OrgID: insertId,
            ssRole: instituteData.Role ?? null,
            ssAcademic: instituteData.Academic ?? null,
            ssInternational: instituteData.International ?? null,
            ssIAUMembership: instituteData.IAUMembership ?? null,
        };


        const orgTypeTableMap = {
            FB: "whed_orgfinaidbody",
            GB: "whed_orggovbody",
            CB: "whed_orgintcoop",
            RB: "whed_orgrecbody",
            SA: "whed_orgstudentassoc",
            SS: "whed_orgstudentservice",
        };
        const orgTypeSupplementaryDataMap = {
            FB: supplementaryDataForFinancialAID,
            GB: supplementaryDataForGOVBody,
            CB: supplementaryDataForCOOP,
            RB: supplementaryDataForRecognition,
            SA: supplementaryDataForStudentAssociation,
            SS: supplementaryDataForStudentService,
        };


        const targetTable = orgTypeTableMap[instituteData.OrgTypeCode];
        const supplementaryData = orgTypeSupplementaryDataMap[instituteData.OrgTypeCode];



        if (targetTable && supplementaryData) {

            const keys = Object.keys(supplementaryData);
            const values = Object.values(supplementaryData);

            const columns = keys.join(", ");
            const placeholders = keys.map(() => "?").join(", ");

            await connection.query(
                `INSERT INTO ${targetTable} (${columns}) VALUES (${placeholders})`,
                values
            );
        }



        await connection.commit();


        return { id: insertId || null };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Database Service Transaction Error:", error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }


};



const createBodiesContactService = async (stateId, orgID, contactData) => {

    const mapData = {

        OrgID: orgID,
        Surname: contactData.Surname,
        FirstName: contactData.FirstName,
        JobTitle: contactData.JobTitle,
        JobFunctionCode: contactData.JobFunctionCode,
        YearsOfOffice: contactData.YearsOfOffice,
        ContactTel: contactData.ContactTel,
        ContactEMail: contactData.ContactEMail,
        Sex: contactData.Sex,
    };



    const query = `
        INSERT INTO whed_contact (
            OrgID,
            Surname,
            FirstName,
            JobTitle,
            JobFunctionCode,
            YearsOfOffice,
            ContactTel,
            ContactEMail,
            Sex
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        mapData.OrgID,
        mapData.Surname,
        mapData.FirstName,
        mapData.JobTitle,
        mapData.JobFunctionCode,
        mapData.YearsOfOffice,
        mapData.ContactTel,
        mapData.ContactEMail,
        mapData.Sex
    ];

    const [result] = await pool.query(query, values);

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
    };
};


const deleteBodiesServices = async (orgId, orgTypeCode) => {

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const orgTypeTableMap = {
            FB: "whed_orgfinaidbody",
            GB: "whed_orggovbody",
            CB: "whed_orgintcoop",
            RB: "whed_orgrecbody",
            SA: "whed_orgstudentassoc",
            SS: "whed_orgstudentservice",
        };

        const targetTable = orgTypeTableMap[orgTypeCode];

        if (!targetTable) {
            throw new Error("Invalid OrgTypeCode");
        }

        const deleteSupplementaryQuery = `
            DELETE FROM ${targetTable}
            WHERE OrgID = ?
        `;

        const deleteOrgQuery = `
            DELETE FROM whed_org
            WHERE OrgID = ?
        `;

        await connection.query(deleteSupplementaryQuery, [orgId]);
        const [result] = await connection.query(deleteOrgQuery, [orgId]);

        await connection.commit();

        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};


const deleteBodiesContactServices = async (contactID) => {

    const query = `DELETE FROM whed_contact WHERE  ContactID = ?`;
    const [result] = await pool.query(query, [contactID]);
    return result;

};



const updateBodiesService = async (stateId, orgId, orgCodeType, bodiesData) => {

    // Get State Information
    const [rows] = await pool.query(
        `
        SELECT
            StateID,
            CountryCode,
            StateCode
        FROM whed_state
        WHERE StateID = ?
        `,
        [stateId]
    );

    const stateInfo = rows[0];

    const mappedData = {};

    mappedData.OrgName = bodiesData.OrgName?.trim() || "";
    mappedData.InstNameEnglish = bodiesData.InstNameEnglish?.trim() || "";
    mappedData.iBranchName = bodiesData.branchof?.trim() || "";
    mappedData.iBranchNameEnglish = bodiesData.branchof?.trim() || "";
    mappedData.iRecordHistory = bodiesData.recordHistory?.trim() || "";
    mappedData.iInstClassHistory = bodiesData.iInstClassHistory?.trim() || "";

    if (bodiesData.GlobalID) mappedData.GlobalID = bodiesData.GlobalID.trim();

    if (stateInfo) {
        mappedData.StateID = stateInfo.StateID;
        mappedData.CountryCode = stateInfo.CountryCode;
        mappedData.StateCode = stateInfo.StateCode;
    }

    if (bodiesData.OrgTypeCode)
        mappedData.OrgTypeCode = bodiesData.OrgTypeCode.trim();

    if (bodiesData.acronym)
        mappedData.InstAcronym = bodiesData.acronym.trim();

    if (bodiesData.street)
        mappedData.Street = bodiesData.street.trim();

    if (bodiesData.city)
        mappedData.City = bodiesData.city.trim();

    if (bodiesData.province)
        mappedData.Province = bodiesData.province.trim();

    if (bodiesData.postalCode)
        mappedData.PostCode = bodiesData.postalCode.trim();

    if (bodiesData.tel)
        mappedData.Tel = bodiesData.tel.trim();

    if (bodiesData.fax)
        mappedData.Fax = bodiesData.fax.trim();

    if (bodiesData.email)
        mappedData.EMail = bodiesData.email.trim();

    if (bodiesData.website)
        mappedData.WWW = bodiesData.website.trim();

    if (bodiesData.logo)
        mappedData.iLogo = bodiesData.logo.trim();

    mappedData.iWebUpdateDate = new Date();

    let connection;

    try {

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // ===============================
        // Update whed_org
        // ===============================

        const columns = Object.keys(mappedData)
            .map((key) => `${key} = ?`)
            .join(", ");

        const values = [
            ...Object.values(mappedData),
            orgId,
        ];

        await connection.query(
            `UPDATE whed_org
             SET ${columns}
             WHERE OrgID = ?`,
            values
        );

        // ===============================
        // Supplementary Data
        // ===============================

        const supplementaryDataForGOVBody = {
            GovBodyRole: bodiesData.Role ?? null,
            GovBodyAcademic: bodiesData.Academic ?? null,
            GovBodyInternational: bodiesData.International ?? null,
            GovBodyIAUMembership: bodiesData.IAUMembership ?? null,
        };

        const supplementaryDataForFinancialAID = {
            faRole: bodiesData.Role ?? null,
            faAcademic: bodiesData.Academic ?? null,
            faInternational: bodiesData.International ?? null,
            faIAUMembership: bodiesData.IAUMembership ?? null,
            FaGrants: bodiesData.FaGrants ?? null,
            FaLoans: bodiesData.FaLoans ?? null,
            FaStudentCat: bodiesData.FaStudentCat ?? null,
        };

        const supplementaryDataForCOOP = {
            icRole: bodiesData.Role ?? null,
            icAcademic: bodiesData.Academic ?? null,
            icInternational: bodiesData.International ?? null,
            icIAUMembership: bodiesData.IAUMembership ?? null,
        };

        const supplementaryDataForRecognition = {
            rbRole: bodiesData.Role ?? null,
            rbAcademic: bodiesData.Academic ?? null,
            rbInternational: bodiesData.International ?? null,
            rbIAUMembership: bodiesData.IAUMembership ?? null,
            rbForeignCredInstitution: bodiesData.rbForeignCredInstitution ?? null,
            rbForeignCredProfession: bodiesData.rbForeignCredProfession ?? null,
            rbRecServices: bodiesData.rbRecServices ?? null,
        };

        const supplementaryDataForStudentAssociation = {
            saRole: bodiesData.Role ?? null,
            saAcademic: bodiesData.Academic ?? null,
            saInternational: bodiesData.International ?? null,
            saIAUMembership: bodiesData.IAUMembership ?? null,
        };

        const supplementaryDataForStudentService = {
            ssRole: bodiesData.Role ?? null,
            ssAcademic: bodiesData.Academic ?? null,
            ssInternational: bodiesData.International ?? null,
            ssIAUMembership: bodiesData.IAUMembership ?? null,
        };

        const orgTypeTableMap = {
            FB: "whed_orgfinaidbody",
            GB: "whed_orggovbody",
            CB: "whed_orgintcoop",
            RB: "whed_orgrecbody",
            SA: "whed_orgstudentassoc",
            SS: "whed_orgstudentservice",
        };

        const orgTypeSupplementaryDataMap = {
            FB: supplementaryDataForFinancialAID,
            GB: supplementaryDataForGOVBody,
            CB: supplementaryDataForCOOP,
            RB: supplementaryDataForRecognition,
            SA: supplementaryDataForStudentAssociation,
            SS: supplementaryDataForStudentService,
        };

        const table = orgTypeTableMap[orgCodeType];
        const supplementaryData = orgTypeSupplementaryDataMap[orgCodeType];

        if (table && supplementaryData) {

            const setClause = Object.keys(supplementaryData)
                .map((key) => `${key} = ?`)
                .join(", ");

            const values = [
                ...Object.values(supplementaryData),
                orgId,
            ];

            await connection.query(
                `UPDATE ${table}
                 SET ${setClause}
                 WHERE OrgID = ?`,
                values
            );
        }

        await connection.commit();

        return {
            success: true,
            id: orgId,
        };

    } catch (error) {

        if (connection) await connection.rollback();
        throw error;

    } finally {

        if (connection) connection.release();

    }

};




const updateBodiesContactService = async (contactId, contactID, contactData) => {

    const mapData = {
        Surname: contactData.Surname,
        FirstName: contactData.FirstName,
        JobTitle: contactData.JobTitle,
        JobFunctionCode: contactData.JobFunctionCode,
        YearsOfOffice: contactData.YearsOfOffice,
        ContactTel: contactData.ContactTel,
        ContactEMail: contactData.ContactEMail,
        Sex: contactData.Sex,
    };

    const query = `
        UPDATE whed_contact
        SET
            Surname = ?,
            FirstName = ?,
            JobTitle = ?,
            JobFunctionCode = ?,
            YearsOfOffice = ?,
            ContactTel = ?,
            ContactEMail = ?,
            Sex = ?
        WHERE ContactID = ?
    `;

    const values = [
        mapData.Surname,
        mapData.FirstName,
        mapData.JobTitle,
        mapData.JobFunctionCode,
        mapData.YearsOfOffice,
        mapData.ContactTel,
        mapData.ContactEMail,
        mapData.Sex,
        contactID
    ];

    const [result] = await pool.query(query, values);

    return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
    };
};


export {
    createAgreementService, createBodiesContactService, createBodiesService, createDecree, createExchangeprogramService, createLanguageService, createSchool, createStageService, createStateSystem, createTypeOfHeisService, deleteAgreement, deleteBodiesContactServices, deleteBodiesServices, deleteDecree, deleteExchangeprogram, deleteLanguage, deleteSchool, deleteStage, deleteStateSystem, deleteTypeOfHeisService, getAgreementByStateIDService, getDecreesByStateId, getEducationSystemByStateIdService, getSchoolsByStateId,
    getStateSystems,
    getTotalStateSystems, updateBodiesContactService, updateBodiesService, updateDecree,
    updateSchool, updateStageServices, updateStateSystem,
    updateTypeOfHeisService
};

