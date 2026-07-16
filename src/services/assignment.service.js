import pool from '../config/db.js';

// Country Assignments
const getCountryAssignments = async (userId) => {
    let query = `
    SELECT 
        link.UserID as userId,
        link.StateID as stateId,
        s.Country as countryName,
        s.State as stateName,
        u.nom as editorName,
        u.login as editorLogin
    FROM whed_resp_country link
    JOIN whed_state s ON link.StateID = s.StateID
    JOIN whed_users u ON link.UserID = u.UserID
  `;
    const params = [];
    if (userId) {
        query += ` WHERE link.UserID = ?`;
        params.push(userId);
    }
    const [rows] = await pool.query(query, params);
    return rows;
};

const assignCountry = async (assignmentData) => {
    const { UserID, StateID } = assignmentData;
    const query = `INSERT INTO whed_resp_country (UserID, StateID) VALUES (?, ?)`;
    await pool.query(query, [UserID, StateID]);
    return assignmentData;
};

const removeCountryAssignment = async (userId, stateId) => {
    const query = `DELETE FROM whed_resp_country WHERE UserID = ? AND StateID = ?`;
    const [result] = await pool.query(query, [userId, stateId]);
    return result;
};

// Institution Assignments
const getInstitutionAssignments = async (userId) => {
    let query = `
    SELECT 
        link.UserID as userId,
        link.StateID as stateId,
        link.Exclusif as exclusive,
        s.Country as countryName,
        s.State as stateName,
        u.nom as editorName,
        u.login as editorLogin
    FROM whed_resp_institution link
    JOIN whed_state s ON link.StateID = s.StateID
    JOIN whed_users u ON link.UserID = u.UserID
  `;
    const params = [];
    if (userId) {
        query += ` WHERE link.UserID = ?`;
        params.push(userId);
    }
    const [rows] = await pool.query(query, params);
    return rows;
};

const assignInstitution = async (assignmentData) => {
    const { UserID, StateID, Exclusif } = assignmentData;
    const query = `INSERT INTO whed_resp_institution (UserID, StateID, Exclusif) VALUES (?, ?, ?)`;
    await pool.query(query, [UserID, StateID, Exclusif]);
    return assignmentData;
};

const removeInstitutionAssignment = async (userId, stateId) => {
    const query = `DELETE FROM whed_resp_institution WHERE UserID = ? AND StateID = ?`;
    const [result] = await pool.query(query, [userId, stateId]);
    return result;
};



const educationSystemCredWithinInstitutionServices = async (updateAssignData) => {

    const {
        StateID,
        eduSystemCredUserID,
        InstituteCredUserID,
        Exclusif,
    } = updateAssignData;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Update whed_resp_institution
        const institutionQuery = `
            UPDATE whed_resp_institution
            SET
                UserID = ?,
                Exclusif = ?
            WHERE StateID = ?
        `;

        await connection.query(institutionQuery, [
            InstituteCredUserID,
            Exclusif,
            StateID,
        ]);

        // Update whed_resp_country
        const countryQuery = `
            UPDATE whed_resp_country
            SET
                UserID = ?
            WHERE StateID = ?
        `;

        await connection.query(countryQuery, [
            eduSystemCredUserID,
            StateID,
        ]);

        await connection.commit();

        return {
            success: true,
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

}




export {
    assignCountry,
    assignInstitution, educationSystemCredWithinInstitutionServices, getCountryAssignments,
    getInstitutionAssignments,
    removeCountryAssignment,
    removeInstitutionAssignment
};

