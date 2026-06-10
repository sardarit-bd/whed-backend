import crypto from "crypto";
import pool from '../config/db.js';

const ALLOWED_DP_FIELDS = new Set([
    "StateID", "DPTypeContact", "DPControle", "DPOrgName", "DPName", 
    "DPStreet", "DPCity", "DPProvince", "DPPostCode", "DPEMail", 
    "DPEMailCopie", "DPStatus", "DPFlag", "DPDateEnvoi", "DPDateRelance", 
    "DPDateLimite", "DPDateRetour", "DPDateValid", "DPDateAcces", 
    "DPDateModif", "DPHistRelance"
]);

const ALLOWED_ORG_DP_FIELDS = new Set([
    "OrgName", "InstNameEnglish", "Street", "City", "Province", 
    "PostCode", "Tel", "Fax", "WWW", "iAdmissionRequirements", 
    "iFeesN", "iFeesI", "iLanguagesUsed", "iAccreditingAgency"
]);

const getDataProviders = async (limit, offset, status) => {
    let query = `
    SELECT 
        ProvID as id,
        StateID as stateId,
        DPOrgName as orgName,
        DPName as name,
        DPEMail as email,
        DPStatus as status,
        DPControle as token
    FROM whed_data_provider
  `;
    const params = [];
    if (status !== undefined && status !== null) {
        query += ` WHERE DPStatus = ?`;
        params.push(status);
    }
    query += ` ORDER BY ProvID DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

const getTotalDataProviders = async (status) => {
    let query = 'SELECT COUNT(*) as total FROM whed_data_provider';
    const params = [];
    if (status !== undefined && status !== null) {
        query += ' WHERE DPStatus = ?';
        params.push(status);
    }
    const [result] = await pool.query(query, params);
    return result[0].total;
};

const getDataProviderById = async (id) => {
    const query = `SELECT * FROM whed_data_provider WHERE ProvID = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};

const createDataProvider = async (dpData) => {
    const keys = Object.keys(dpData).filter(key => ALLOWED_DP_FIELDS.has(key));
    const values = keys.map(key => dpData[key]);

    if (keys.length === 0) {
        throw new Error("No valid data provider fields provided");
    }

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_data_provider (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);
    return { id: result.insertId };
};

const updateDataProvider = async (id, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_DP_FIELDS.has(key));
    if (keys.length === 0) return { affectedRows: 0 };

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_data_provider SET ${setClause} WHERE ProvID = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
};

const deleteDataProvider = async (id) => {
    const query = `DELETE FROM whed_data_provider WHERE ProvID = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

// Generate access token for workflow
const generateSecurityToken = async (email, isInstitution = false, targetId = null) => {
    const token = crypto.randomBytes(16).toString("hex");
    const nowUnix = Math.floor(Date.now() / 1000);
    const limitUnix = nowUnix + (30 * 24 * 60 * 60); // 30 days expiry

    if (isInstitution && targetId) {
        // Update whed_org record
        const query = `
      UPDATE whed_org 
      SET 
        DPControle = ?, 
        DPDateEnvoi = ?, 
        DPStatus = 1
      WHERE OrgID = ? AND DPEMail = ?
    `;
        const [result] = await pool.query(query, [token, nowUnix, targetId, email]);
        if (result.affectedRows === 0) {
            throw new Error("No matching institution found with this email");
        }
        return { token, targetId, email, type: "institution" };
    } else {
        // Update whed_data_provider record
        const query = `
      UPDATE whed_data_provider 
      SET 
        DPControle = ?, 
        DPDateEnvoi = ?, 
        DPDateLimite = ?, 
        DPStatus = 1
      WHERE DPEMail = ?
    `;
        const [result] = await pool.query(query, [token, nowUnix, limitUnix, email]);
        if (result.affectedRows === 0) {
            throw new Error("No matching data provider found with this email");
        }
        return { token, email, type: "system" };
    }
};

// Verify security token
const verifySecurityToken = async (token) => {
    const nowUnix = Math.floor(Date.now() / 1000);

    // 1. Check whed_org (institution)
    const orgQuery = `SELECT OrgID as id, OrgName, DPEMail, DPStatus, DPDateEnvoi FROM whed_org WHERE DPControle = ?`;
    const [orgRows] = await pool.query(orgQuery, [token]);
    if (orgRows.length > 0) {
        const org = orgRows[0];
        // Enforce 30-day token expiry for security
        const sentDate = parseInt(org.DPDateEnvoi) || 0;
        if (nowUnix - sentDate > 30 * 24 * 60 * 60) {
            // Update status to 3 (Exceeded Deadline)
            await pool.query(`UPDATE whed_org SET DPStatus = 3 WHERE OrgID = ?`, [org.id]);
            throw new Error("Token has expired");
        }

        // Update status to 4 (Logged In / Updating) and set DateAcces
        await pool.query(`
      UPDATE whed_org 
      SET DPStatus = 4, DPDateAcces = ? 
      WHERE OrgID = ?
    `, [nowUnix, org.id]);

        return { type: "institution", id: org.id, name: org.OrgName, email: org.DPEMail };
    }

    // 2. Check whed_data_provider (state/system)
    const dpQuery = `SELECT ProvID as id, DPOrgName, DPEMail, DPStatus, DPDateLimite FROM whed_data_provider WHERE DPControle = ?`;
    const [dpRows] = await pool.query(dpQuery, [token]);
    if (dpRows.length > 0) {
        const dp = dpRows[0];
        const limitDate = parseInt(dp.DPDateLimite) || 0;
        if (nowUnix > limitDate) {
            await pool.query(`UPDATE whed_data_provider SET DPStatus = 3 WHERE ProvID = ?`, [dp.id]);
            throw new Error("Token has expired");
        }

        await pool.query(`
      UPDATE whed_data_provider 
      SET DPStatus = 4, DPDateAcces = ? 
      WHERE ProvID = ?
    `, [nowUnix, dp.id]);

        return { type: "system", id: dp.id, name: dp.DPOrgName, email: dp.DPEMail };
    }

    throw new Error("Invalid access token");
};

// Submit profile updates from data provider
const submitDataProviderUpdates = async (token, updateData) => {
    const verified = await verifySecurityToken(token);
    const nowUnix = Math.floor(Date.now() / 1000);

    if (verified.type === "institution") {
        const keys = Object.keys(updateData).filter(key => ALLOWED_ORG_DP_FIELDS.has(key));
        if (keys.length === 0) {
            throw new Error("No valid update fields provided");
        }

        const values = keys.map(key => updateData[key]);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        // Apply changes, set status to 5 (Under Review), and set DateRetour
        const query = `
      UPDATE whed_org 
      SET 
        ${setClause}, 
        DPStatus = 5, 
        DPDateRetour = ? 
      WHERE OrgID = ?
    `;

        await pool.query(query, [...values, nowUnix, verified.id]);
        return { success: true, id: verified.id, type: "institution" };
    } else {
        // For general country systems data provider, update DPDateRetour and status to Under Review (5)
        const query = `
      UPDATE whed_data_provider 
      SET 
        DPStatus = 5, 
        DPDateRetour = ?, 
        DPDateModif = ?
      WHERE ProvID = ?
    `;
        await pool.query(query, [nowUnix, nowUnix, verified.id]);
        return { success: true, id: verified.id, type: "system" };
    }
};

export {
    createDataProvider,
    deleteDataProvider,
    generateSecurityToken,
    getDataProviderById,
    getDataProviders,
    getTotalDataProviders,
    submitDataProviderUpdates,
    updateDataProvider,
    verifySecurityToken
};
