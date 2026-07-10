import pool from '../config/db.js';
import addHistoryLogforOrg from "../utils/addHistoryLogforOrg.js";

const ALLOWED_CRED_FIELDS = new Set([
    "Cred", "cAcronym", "CredCatCode1", "CredCatCode2", "CredlevelCode", "cDescription", "cAlternativeQualification", "cEntryExamNational", "cEntryExamInst"
]);

const getAllCredentials = async (stateId, levelCode) => {
    let query = `
    SELECT 
        CredID as id,
        StateID as stateId,
        Cred as name,
        cAcronym as acronym,
        CredLevelCode as levelCode
    FROM whed_cred
  `;
    const params = [];
    const conditions = [];

    if (stateId) {
        conditions.push(`StateID = ?`);
        params.push(stateId);
    }
    if (levelCode) {
        conditions.push(`CredLevelCode = ?`);
        params.push(levelCode);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY CredID DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
};

const getTotalCredentials = async (stateId, levelCode) => {
    let query = 'SELECT COUNT(*) as total FROM whed_cred';
    const params = [];
    const conditions = [];

    if (stateId) {
        conditions.push(`StateID = ?`);
        params.push(stateId);
    }
    if (levelCode) {
        conditions.push(`CredLevelCode = ?`);
        params.push(levelCode);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    const [result] = await pool.query(query, params);
    return result[0].total;
};

const getSingleCredential = async (id) => {
    const query = `
    SELECT 
        CredID as id,
          CredID,
        StateID as stateId,
        StateID,
        Cred as name,
        Cred,
        cAcronym as acronym,
        cAcronym,
        CredCatCode1,
        CredCatCode2,
        CredLevelCode as levelCode,
        CredLevelCode,
        cDescription as description,
        cDescription,
        cAlternativeQualification,
        cEntryExamNational as entryExamNational,
        cEntryExamNational,
        cEntryExamInst as entryExamInst,
        cEntryExamInst,
        cMajorUpdateDate,
        cMinorUpdateDate,
        cMajorUpdateDateDP,
        cRecordHistory,
        UserID as userId,
        UserID,
        cWarning,
        cDelete
    FROM whed_cred
    WHERE CredID = ?
  `;
    const [rows] = await pool.query(query, [id]);
    const credential = rows[0];
    if (!credential) return null;

    // Fetch prerequisite credential details
    const prereqQuery = `
    SELECT 
        c.CredID as id, 
        c.Cred as name, 
        c.cAcronym as acronym
    FROM whed_tblcredreqcredlink link
    JOIN whed_cred c ON link.CredID_Req = c.CredID
    WHERE link.CredID = ?
  `;
    const [prereqRows] = await pool.query(prereqQuery, [id]);

    // Fetch institution types linked
    const instTypeQuery = `
    SELECT 
        it.sInstTypeID as id, 
        it.sInstType as name, 
        it.sInstTypeEnglish as nameInEnglish
    FROM whed_tblcredtypeinstlink link
    JOIN whed_tcsinsttype it ON link.sTypeInstID = it.sInstTypeID
    WHERE link.CredID = ?
  `;
    const [instTypeRows] = await pool.query(instTypeQuery, [id]);

    return {
        ...credential,
        prerequisites: prereqRows,
        institutionTypes: instTypeRows
    };
};


const createCredential = async (credentialData, user) => {
    const mappedData = {};


    // ==========================
    // Mapping
    // ==========================
    if (credentialData)
        mappedData.StateID = parseInt(credentialData.StateID, 10);

    mappedData.UserID = user ? user.UserID : null;

    if (credentialData)
        mappedData.Cred = credentialData.Cred?.trim();

    if (credentialData)
        mappedData.cAcronym = credentialData.cAcronym?.trim();

    if (credentialData)
        mappedData.CredCatCode1 = credentialData.CredCatCode1?.trim();

    if (credentialData)
        mappedData.CredCatCode2 = credentialData.CredCatCode2?.trim();

    if (credentialData)
        mappedData.CredLevelCode = credentialData.CredLevelCode?.trim();

    if (credentialData)
        mappedData.cDescription = credentialData.cDescription?.trim();

    if (credentialData)
        mappedData.cAlternativeQualification =
            credentialData.cAlternativeQualification?.trim();

    if (credentialData)
        mappedData.cEntryExamNational = credentialData.cEntryExamNational ? parseInt(credentialData.cEntryExamNational, 10) : null;

    if (credentialData)
        mappedData.cEntryExamInst = credentialData.cEntryExamInst ? parseInt(credentialData.cEntryExamInst, 10) : null;


    if (credentialData)
        mappedData.cRecordHistory = credentialData.cRecordHistory ? credentialData.cRecordHistory?.trim() : " ";

    mappedData.cMajorUpdateDate = null;
    mappedData.cMinorUpdateDate = null;
    mappedData.cMajorUpdateDateDP = new Date();
    mappedData.cWarning = 0;
    mappedData.cDelete = 0;


    // ==========================
    // Insert
    // ==========================
    const keys = Object.keys(mappedData);
    const values = Object.values(mappedData);

    if (keys.length === 0) {
        throw new Error("No valid credential fields provided.");
    }

    const columns = keys.join(", ");
    const placeholders = keys.map(() => "?").join(", ");

    const query = `INSERT INTO whed_cred (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);

    return {
        id: result.insertId,
    };
};


const updateCredential = async (id, updateData, user) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Whitelist and sanitize fields
        const keys = Object.keys(updateData).filter(key =>
            ALLOWED_CRED_FIELDS.has(key)
        );

        if (keys.length === 0) {
            await connection.rollback();
            return { affectedRows: 0 };
        }

        const values = keys.map(key => updateData[key]);

        // Update Query
        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const query = `UPDATE whed_cred SET ${setClause} WHERE CredID = ?`;

        const [result] = await connection.query(query, [...values, id]);

        // Add History
        await addHistoryLogforOrg({
            db: connection,
            tableName: "whed_cred",
            id,
            idColumn: "CredID",
            historyColumn: "cRecordHistory",
            action: "MINOR update",
            user: user?.name,
        });

        await connection.commit();

        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const deleteCredential = async (id) => {
    const query = `DELETE FROM whed_cred WHERE CredID = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

const linkPrerequisites = async (credId, CredID_Req) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Remove old links
        // await connection.query(`DELETE FROM whed_tblcredreqcredlink WHERE CredID = ?`, [credId]);

        // Insert new ones
        await connection.query(
            `INSERT INTO whed_tblcredreqcredlink (CredID, CredID_Req) VALUES (?, ?)`,
            [credId, CredID_Req]
        );

        await connection.commit();
        return { success: true };
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

const linkInstitutionTypes = async (credId, instTypeIds) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Remove old links
        // await connection.query(`DELETE FROM whed_tblcredtypeinstlink WHERE CredID = ?`, [credId]);

        // Insert new ones
        await connection.query(
            `INSERT INTO whed_tblcredtypeinstlink (CredID, sTypeInstID) VALUES (?, ?)`,
            [credId, instTypeIds]
        );

        await connection.commit();
        return { success: true };
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

const getCredentialsByStateId = async (stateId) => {
    const query = `
    SELECT 
        CredID as id,
        CredID,
        StateID as stateId,
        StateID,
        Cred as name,
        Cred,
        cAcronym as acronym,
        cAcronym,
        CredCatCode1,
        CredCatCode2,
        CredLevelCode as levelCode,
        CredLevelCode,
        cDescription as description,
        cDescription,
        cAlternativeQualification,
        cEntryExamNational as entryExamNational,
        cEntryExamNational,
        cEntryExamInst as entryExamInst,
        cEntryExamInst,
        cMajorUpdateDate,
        cMinorUpdateDate,
        cMajorUpdateDateDP,
        cRecordHistory,
        UserID as userId,
        UserID,
        cWarning,
        cDelete
    FROM whed_cred
    WHERE StateID = ?
    ORDER BY CredID DESC
  `;
    const [rows] = await pool.query(query, [stateId]);
    return rows;
};



const deletePrerequisitesService = async (credId, preId) => {
    const query = `DELETE FROM whed_tblcredreqcredlink WHERE CredID = ? AND CredID_Req = ?`;
    const [result] = await pool.query(query, [credId, preId]);
    return result;
};

const deleteInstitutionTypesService = async (credId, instTypeId) => {
    const query = `DELETE FROM whed_tblcredtypeinstlink WHERE CredID = ? AND sTypeInstID = ?`;
    const [result] = await pool.query(query, [credId, instTypeId]);
    return result;
};


export {
    createCredential,
    deleteCredential, deleteInstitutionTypesService,
    deletePrerequisitesService, getAllCredentials, getCredentialsByStateId, getSingleCredential,
    getTotalCredentials, linkInstitutionTypes,
    linkPrerequisites,
    updateCredential
};

