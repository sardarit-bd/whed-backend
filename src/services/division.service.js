import pool from '../config/db.js';

const ALLOWED_DIVISION_FIELDS = new Set([
    "OrgID", "iDivision", "iDivisionTypeCode", "iMoreDetails"
]);

const getAllDivisions = async (orgId) => {
    let query = `
    SELECT 
        iDivisionID as id,
        OrgID as orgId,
        iDivision as name,
        iDivisionTypeCode as typeCode,
        iMoreDetails as moreDetails
    FROM whed_division
  `;
    const params = [];
    if (orgId) {
        query += ` WHERE OrgID = ?`;
        params.push(orgId);
    }

    query += ` ORDER BY iDivisionID DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
};

const getTotalDivisions = async (orgId) => {
    let query = 'SELECT COUNT(*) as total FROM whed_division';
    const params = [];
    if (orgId) {
        query += ' WHERE OrgID = ?';
        params.push(orgId);
    }
    const [result] = await pool.query(query, params);
    return result[0].total;
};

const getSingleDivision = async (id) => {
    const query = `
    SELECT 
        iDivisionID as id,
        OrgID as orgId,
        iDivision as name,
        iDivisionTypeCode as typeCode,
        iMoreDetails as moreDetails
    FROM whed_division
    WHERE iDivisionID = ?
  `;
    const [rows] = await pool.query(query, [id]);
    const division = rows[0];
    if (!division) return null;

    // Fetch fields of study linked
    const fosQuery = `
    SELECT 
        f.FOSCode as code, 
        f.FOSDisplay as display
    FROM whed_tlidivisionfoslink link
    JOIN whed_lex_fos f ON link.FOSCode = f.FOSCode
    WHERE link.iDivisionID = ?
  `;
    const [fosRows] = await pool.query(fosQuery, [id]);

    return {
        ...division,
        fieldsOfStudy: fosRows
    };
};

const createDivision = async (divisionData) => {
    const keys = Object.keys(divisionData).filter(key => ALLOWED_DIVISION_FIELDS.has(key));
    const values = keys.map(key => divisionData[key]);

    if (keys.length === 0) {
        throw new Error("No valid division fields provided");
    }

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_division (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);
    return { id: result.insertId };
};

const updateDivision = async (id, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_DIVISION_FIELDS.has(key));

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_division SET ${setClause} WHERE iDivisionID = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
};

const deleteDivision = async (id) => {
    const query = `DELETE FROM whed_division WHERE iDivisionID = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

const linkDivisionFos = async (divisionId, fosCodes) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Delete old links
        await connection.query(`DELETE FROM whed_tlidivisionfoslink WHERE iDivisionID = ?`, [divisionId]);

        // Insert new ones
        if (fosCodes && fosCodes.length > 0) {
            const values = fosCodes.map(code => [divisionId, code]);
            await connection.query(`INSERT INTO whed_tlidivisionfoslink (iDivisionID, FOSCode) VALUES ?`, [values]);
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

export {
    createDivision,
    deleteDivision,
    getAllDivisions,
    getSingleDivision,
    getTotalDivisions,
    linkDivisionFos,
    updateDivision
};
