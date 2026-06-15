import pool from '../config/db.js';

const ALLOWED_CONTACT_FIELDS = new Set([
    "OrgID", "JobTitle", "FirstName", "Surname", "Sex", "JobFunctionCode", "ContactEMail", "EMail"
]);

const getAllContacts = async (orgId) => {
    let query = `
    SELECT 
        ContactID as id,
        OrgID as orgId,
        JobTitle as jobTitle,
        FirstName as firstName,
        Surname as surname,
        Sex as sex,
        JobFunctionCode as jobFunctionCode,
        ContactEMail as contactEmail,
        EMail as email
    FROM whed_contact
  `;
    const params = [];
    if (orgId) {
        query += ` WHERE OrgID = ?`;
        params.push(orgId);
    }

    query += ` ORDER BY ContactID DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
};

const getTotalContacts = async (orgId) => {
    let query = 'SELECT COUNT(*) as total FROM whed_contact';
    const params = [];
    if (orgId) {
        query += ' WHERE OrgID = ?';
        params.push(orgId);
    }
    const [result] = await pool.query(query, params);
    return result[0].total;
};

const getSingleContact = async (id) => {
    const query = `
    SELECT 
        ContactID as id,
        OrgID as orgId,
        JobTitle as jobTitle,
        FirstName as firstName,
        Surname as surname,
        Sex as sex,
        JobFunctionCode as jobFunctionCode,
        ContactEMail as contactEmail,
        EMail as email
    FROM whed_contact
    WHERE ContactID = ?
  `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};

const createContact = async (contactData) => {
    const keys = Object.keys(contactData).filter(key => ALLOWED_CONTACT_FIELDS.has(key));
    const values = keys.map(key => contactData[key]);

    if (keys.length === 0) {
        throw new Error("No valid contact fields provided");
    }

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_contact (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);
    return { id: result.insertId };
};

const updateContact = async (id, updateData) => {
    const keys = Object.keys(updateData).filter(key => ALLOWED_CONTACT_FIELDS.has(key));

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_contact SET ${setClause} WHERE ContactID = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
};

const deleteContact = async (id) => {
    const query = `DELETE FROM whed_contact WHERE ContactID = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

export { createContact, deleteContact, getAllContacts, getSingleContact, getTotalContacts, updateContact };
