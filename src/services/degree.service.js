import pool from '../config/db.js';

const ALLOWED_DEGREE_FIELDS = new Set([
    "OrgID", "iDegree", "CredID", "iDegreeOrigine", "iDegreeNote"
]);

const getAllDegrees = async (limit, offset, orgId, credId) => {
    let query = `
    SELECT 
        d.iDegreeID as id,
        d.OrgID as orgId,
        d.iDegree as name,
        d.CredID as credId,
        c.Cred as credentialName,
        d.iDegreeOrigine as originalTitle,
        d.iDegreeNote as note
    FROM whed_degree d
    LEFT JOIN whed_cred c ON d.CredID = c.CredID
  `;
    const params = [];
    const conditions = [];

    if (orgId) {
        conditions.push(`d.OrgID = ?`);
        params.push(orgId);
    }
    if (credId) {
        conditions.push(`d.CredID = ?`);
        params.push(credId);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY d.iDegreeID DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

const getTotalDegrees = async (orgId, credId) => {
    let query = 'SELECT COUNT(*) as total FROM whed_degree d';
    const params = [];
    const conditions = [];

    if (orgId) {
        conditions.push(`d.OrgID = ?`);
        params.push(orgId);
    }
    if (credId) {
        conditions.push(`d.CredID = ?`);
        params.push(credId);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    const [result] = await pool.query(query, params);
    return result[0].total;
};

const getSingleDegree = async (id) => {
    const query = `
    SELECT 
        d.iDegreeID as id,
        d.OrgID as orgId,
        d.iDegree as name,
        d.CredID as credId,
        c.Cred as credentialName,
        d.iDegreeOrigine as originalTitle,
        d.iDegreeNote as note
    FROM whed_degree d
    LEFT JOIN whed_cred c ON d.CredID = c.CredID
    WHERE d.iDegreeID = ?
  `;
    const [rows] = await pool.query(query, [id]);
    const degree = rows[0];
    if (!degree) return null;

    // Fetch fields of study linked
    const fosQuery = `
    SELECT 
        f.FOSCode as code, 
        f.FOSDisplay as display
    FROM whed_tlidegreefoslink link
    JOIN whed_lex_fos f ON link.FOSCode = f.FOSCode
    WHERE link.iDegreeID = ?
  `;
    const [fosRows] = await pool.query(fosQuery, [id]);

    return {
        ...degree,
        fieldsOfStudy: fosRows
    };
};

const createDegree = async (degreeData) => {
    const keys = Object.keys(degreeData).filter(key => ALLOWED_DEGREE_FIELDS.has(key));
    const values = keys.map(key => degreeData[key]);

    if (keys.length === 0) {
        throw new Error("No valid degree fields provided");
    }

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_degree (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);
    return { id: result.insertId };
};

const updateDegree = async (id, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_DEGREE_FIELDS.has(key));

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_degree SET ${setClause} WHERE iDegreeID = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
};

const deleteDegree = async (id) => {
    const query = `DELETE FROM whed_degree WHERE iDegreeID = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

const linkDegreeFos = async (degreeId, fosCodes) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Delete old links
        await connection.query(`DELETE FROM whed_tlidegreefoslink WHERE iDegreeID = ?`, [degreeId]);

        // Insert new ones
        if (fosCodes && fosCodes.length > 0) {
            const values = fosCodes.map(code => [degreeId, code]);
            await connection.query(`INSERT INTO whed_tlidegreefoslink (iDegreeID, FOSCode) VALUES ?`, [values]);
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
    createDegree,
    deleteDegree,
    getAllDegrees,
    getSingleDegree,
    getTotalDegrees,
    linkDegreeFos,
    updateDegree
};
