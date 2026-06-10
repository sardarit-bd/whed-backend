import pool from '../config/db.js';

const getUsers = async (limit, offset) => {
    const query = `
    SELECT  UserID, login, mail, reset_pass, connexion, springer, 
            language, role, status, created, access, nom, prenom, 
            organisme, adresse, cp, ville, pays, tel, fax, web, 
            titre, fonction, expire, payment, attente, IHUBuyer, 
            datepass, totalexport, json, count_error_password, 
            must_reset_password, first_time_password, change_password 
    FROM whed_users
    ORDER BY userID DESC
    LIMIT ? OFFSET ?
  `;
    const [rows] = await pool.query(query, [limit, offset]);
    return rows;
};



const getTotalUsers = async () => {
    const [result] = await pool.query('SELECT COUNT(*) as total FROM whed_users');
    return result[0].total;
};



const getUserById = async (userId) => {

    const query = `
        SELECT UserID, login, mail, reset_pass, connexion, springer, 
            language, role, status, created, access, nom, prenom, 
            organisme, adresse, cp, ville, pays, tel, fax, web, 
            titre, fonction, expire, payment, attente, IHUBuyer, 
            datepass, totalexport, json, count_error_password, 
            must_reset_password, first_time_password, change_password 
        FROM whed_users 
        WHERE UserID = ?
    `;

    const [rows] = await pool.query(query, [userId]);
    return rows[0];
};



const ALLOWED_USER_FIELDS = new Set([
    "login", "pass", "mail", "reset_pass", "connexion", "springer",
    "language", "role", "status", "created", "access", "nom", "prenom",
    "organisme", "adresse", "cp", "ville", "pays", "tel", "fax", "web",
    "titre", "fonction", "expire", "payment", "attente", "IHUBuyer",
    "datepass", "totalexport", "json", "count_error_password",
    "must_reset_password", "first_time_password", "change_password"
]);

const updateUserById = async (userId, updateData) => {
    // Whitelist and sanitize update fields to prevent SQL column injection
    const keys = Object.keys(updateData).filter(key => ALLOWED_USER_FIELDS.has(key));

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);

    // SQL কুয়েরি: SET column1 = ?, column2 = ?
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_users SET ${setClause} WHERE UserID = ?`;

    // কুয়েরির শেষে userId যোগ করছি
    const [result] = await pool.query(query, [...values, userId]);
    return result;
};



export { getTotalUsers, getUserById, getUsers, updateUserById };

