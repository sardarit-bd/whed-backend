import pool from '../config/db.js';

const ALLOWED_STATE_FIELDS = new Set([
    "Country", "State", "CountryCode", "StateCode", "StateAlpha", 
    "ProxyStateID", "Palgrave", "UseCountryCreds", "EdSysLocked", 
    "InstLocked", "Stub", "CredLocked", "Regions", "ISO3"
]);

const getAllStates = async (limit, offset) => {
    const query = `
    SELECT 
        StateID as id,
        Country as country,
        State as state,
        CountryCode as countryCode,
        StateCode as stateCode
    FROM whed_state
    ORDER BY StateID DESC
    LIMIT ? OFFSET ?
  `;
    const [rows] = await pool.query(query, [limit, offset]);
    return rows;
};

const getTotalStates = async () => {
    const [result] = await pool.query('SELECT COUNT(*) as total FROM whed_state');
    return result[0].total;
};

const getSingleState = async (id) => {
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
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};

const createState = async (stateData) => {
    // Whitelist keys to prevent SQL column injection
    const keys = Object.keys(stateData).filter(key => ALLOWED_STATE_FIELDS.has(key));
    const values = keys.map(key => stateData[key]);

    if (keys.length === 0) {
        throw new Error("No valid state fields provided");
    }

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_state (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);
    return { id: result.insertId };
};

const updateState = async (id, updateData) => {
    // Whitelist keys to prevent SQL column injection
    const keys = Object.keys(updateData).filter(key => ALLOWED_STATE_FIELDS.has(key));

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_state SET ${setClause} WHERE StateID = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
};

const deleteState = async (id) => {
    const query = `DELETE FROM whed_state WHERE StateID = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

export { createState, deleteState, getAllStates, getSingleState, getTotalStates, updateState };
