import pool from '../config/db.js';

// Institution Types CRUD
const getInstTypes = async (limit, offset, stateId) => {
    let query = `
    SELECT 
        sInstTypeID as id,
        StateID as stateId,
        sInstTypeSort as sortOrder,
        sInstType as name,
        sInstTypeEnglish as nameInEnglish,
        sInstTypeDescription as description
    FROM whed_tcsinsttype
  `;
    const params = [];
    if (stateId) {
        query += ` WHERE StateID = ?`;
        params.push(stateId);
    }
    query += ` ORDER BY sInstTypeID DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

const getTotalInstTypes = async (stateId) => {
    let query = 'SELECT COUNT(*) as total FROM whed_tcsinsttype';
    const params = [];
    if (stateId) {
        query += ' WHERE StateID = ?';
        params.push(stateId);
    }
    const [result] = await pool.query(query, params);
    return result[0].total;
};

const getInstTypeById = async (id) => {
    const query = `SELECT * FROM whed_tcsinsttype WHERE sInstTypeID = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};

const createInstType = async (instTypeData) => {
    const { StateID, sInstTypeSort, sInstType, sInstTypeEnglish, sInstTypeDescription } = instTypeData;
    const query = `
    INSERT INTO whed_tcsinsttype (StateID, sInstTypeSort, sInstType, sInstTypeEnglish, sInstTypeDescription) 
    VALUES (?, ?, ?, ?, ?)
  `;
    const [result] = await pool.query(query, [StateID, sInstTypeSort, sInstType, sInstTypeEnglish, sInstTypeDescription]);
    return { id: result.insertId };
};

const updateInstType = async (id, updateData) => {
    const keys = Object.keys(updateData);
    if (keys.length === 0) return { affectedRows: 0 };

    const values = Object.values(updateData);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_tcsinsttype SET ${setClause} WHERE sInstTypeID = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
};

const deleteInstType = async (id) => {
    const query = `DELETE FROM whed_tcsinsttype WHERE sInstTypeID = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

// Languages
const getLanguages = async () => {
    const query = `SELECT LanguageCode as code, Language as name FROM whed_lex_language ORDER BY Language ASC`;
    const [rows] = await pool.query(query);
    return rows;
};

const createLanguage = async (langData) => {
    const { LanguageCode, Language } = langData;
    const query = `INSERT INTO whed_lex_language (LanguageCode, Language) VALUES (?, ?)`;
    await pool.query(query, [LanguageCode, Language]);
    return langData;
};

const linkStateLanguage = async (stateId, linkData) => {
    const { LanguageCode, LanguageSort } = linkData;
    const query = `
    INSERT INTO whed_tlsstatelanguagelink (StateID, LanguageCode, LanguageSort) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE LanguageSort = VALUES(LanguageSort)
  `;
    await pool.query(query, [stateId, LanguageCode, LanguageSort]);
    return { stateId, LanguageCode };
};

// Stages
const getStages = async () => {
    const query = `SELECT StageCode as code, Stage as name FROM whed_lex_stage ORDER BY Stage ASC`;
    const [rows] = await pool.query(query);
    return rows;
};

const createStage = async (stageData) => {
    const { StageCode, Stage } = stageData;
    const query = `INSERT INTO whed_lex_stage (StageCode, Stage) VALUES (?, ?)`;
    await pool.query(query, [StageCode, Stage]);
    return stageData;
};

const linkStateStage = async (stateId, linkData) => {
    const { StageCode, sStageName, sStageDescription } = linkData;
    const query = `
    INSERT INTO whed_tlsstatestagelink (StateID, StageCode, sStageName, sStageDescription) 
    VALUES (?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE sStageName = VALUES(sStageName), sStageDescription = VALUES(sStageDescription)
  `;
    await pool.query(query, [stateId, StageCode, sStageName, sStageDescription]);
    return { stateId, StageCode };
};

// Fields of study
const getFieldsOfStudy = async () => {
    const query = `SELECT FOSCode as code, FOSDisplay as name FROM whed_lex_fos ORDER BY FOSDisplay ASC`;
    const [rows] = await pool.query(query);
    return rows;
};

const createFieldOfStudy = async (fosData) => {
    const { FOSCode, FOSDisplay } = fosData;
    const query = `INSERT INTO whed_lex_fos (FOSCode, FOSDisplay) VALUES (?, ?)`;
    await pool.query(query, [FOSCode, FOSDisplay]);
    return fosData;
};

export {
    createFieldOfStudy,
    createInstType,
    createLanguage,
    createStage,
    deleteInstType,
    getFieldsOfStudy,
    getInstTypeById,
    getInstTypes,
    getLanguages,
    getStages,
    getTotalInstTypes,
    linkStateLanguage,
    linkStateStage,
    updateInstType
};
