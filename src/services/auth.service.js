import pool from '../config/db.js';

const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM whed_users WHERE mail = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
};

const getUserByLogin = async (login) => {
    const query = 'SELECT * FROM whed_users WHERE login = ?';
    const [rows] = await pool.query(query, [login]);
    return rows[0];
};

const createUser = async (userData) => {

    // Joi validation theke asha data destructure kore nicchi (status soho)
    const {
        login, pass, mail, nom, prenom,
        role, status, language, organisme,
        adresse, cp, ville, pays, tel, fax, web, titre, fonction
    } = userData;

    // Unix Timestamp toiri kora hocche 'created' column-er jonno 
    // (Jekhetu apnar database-e 'created' int(11) ache, tai ekhane present time deya bhalo)
    const created = Math.floor(Date.now() / 1000);

    const query = `
        INSERT INTO whed_users (
            login, pass, mail, nom, prenom, 
            role, status, language, organisme, 
            adresse, cp, ville, pays, tel, fax, web, titre, fonction, created
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
        login, pass, mail, nom, prenom,
        role, status, language, organisme,
        adresse, cp, ville, pays, tel, fax, web, titre, fonction, created
    ]);

    return { id: result.insertId };
};

const updateUserPassword = async (email, newPassword) => {
    const query = 'UPDATE whed_users SET pass = ? WHERE mail = ?';
    const [result] = await pool.query(query, [newPassword, email]);
    return result;
};

const getOTPByEmail = async (email) => {
    const query = 'SELECT * FROM otp_tracking WHERE email = ? ORDER BY created_at DESC LIMIT 1';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
};

const createOrUpdateOTP = async (otpData) => {
    const { otp, mail, UserID } = otpData;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const deleteQuery = 'DELETE FROM otp_tracking WHERE mail = ?';
        await connection.query(deleteQuery, [mail]);
        const insertQuery = 'INSERT INTO otp_tracking (otp, mail, user_id) VALUES (?, ?, ?)';
        const [result] = await connection.query(insertQuery, [otp, mail, UserID]);
        await connection.commit();
        return { id: result.insertId };
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const deleteOTPByEmail = async (email) => {
    const query = 'DELETE FROM otp_tracking WHERE email = ?';
    const [result] = await pool.query(query, [email]);
    return result;
};


const updateLoginSession = async (userId) => {
    const query = `
        UPDATE whed_users 
        SET 
            access = ?, 
            connexion = connexion + 1, 
            count_error_password = 0 
        WHERE UserID = ?
    `;
    const currentTime = Math.floor(Date.now() / 1000); // Unix Timestamp
    const [result] = await pool.query(query, [currentTime, userId]);
    return result;
};



const incrementPasswordError = async (userId) => {
    const query = `
        UPDATE whed_users 
        SET count_error_password = count_error_password + 1 
        WHERE UserID = ?
    `;
    const [result] = await pool.query(query, [userId]);
    return result;
};


export { createOrUpdateOTP, createUser, deleteOTPByEmail, getOTPByEmail, getUserByEmail, getUserByLogin, incrementPasswordError, updateLoginSession, updateUserPassword };

