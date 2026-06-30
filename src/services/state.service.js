import pool from '../config/db.js';

const ALLOWED_STATE_FIELDS = new Set([
    "Country", "State", "CountryCode", "StateCode", "StateAlpha",
    "ProxyStateID", "Palgrave", "UseCountryCreds", "EdSysLocked",
    "InstLocked", "Stub", "CredLocked", "Regions", "ISO3"
]);

const getAllStates = async () => {
    const query = `
    SELECT 
        StateID as id,
        Country as country,
        State as state,
        CountryCode as countryCode,
        StateCode as stateCode
    FROM whed_state
    ORDER BY StateID DESC
  `;
    const [states] = await pool.query(query);

    if (!states || states.length === 0) {
        return [];
    }

    const stateIds = states.map(s => s.id);

    const countryQuery = `
        SELECT 
            rc.StateID as stateId,
            rc.UserID as userId,
            u.nom as editorName,
            u.login as editorLogin
        FROM whed_resp_country rc
        JOIN whed_users u ON rc.UserID = u.UserID
        WHERE rc.StateID IN (?)
    `;

    const instQuery = `
        SELECT 
            ri.StateID as stateId,
            ri.UserID as userId,
            ri.Exclusif as exclusive,
            u.nom as editorName,
            u.login as editorLogin
        FROM whed_resp_institution ri
        JOIN whed_users u ON ri.UserID = u.UserID
        WHERE ri.StateID IN (?)
    `;

    const [countryRows, instRows] = await Promise.all([
        pool.query(countryQuery, [stateIds]).then(([res]) => res),
        pool.query(instQuery, [stateIds]).then(([res]) => res)
    ]);

    const countryMap = {};
    const instMap = {};

    for (const row of countryRows) {
        if (!countryMap[row.stateId]) {
            countryMap[row.stateId] = [];
        }
        countryMap[row.stateId].push({
            userId: row.userId,
            editorName: row.editorName,
            editorLogin: row.editorLogin
        });
    }

    for (const row of instRows) {
        if (!instMap[row.stateId]) {
            instMap[row.stateId] = [];
        }
        instMap[row.stateId].push({
            userId: row.userId,
            editorName: row.editorName,
            editorLogin: row.editorLogin,
            exclusive: row.exclusive
        });
    }

    return states.map(s => ({
        ...s,
        countryResponsibilities: countryMap[s.id] || [],
        institutionResponsibilities: instMap[s.id] || []
    }));
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

const getMyStates = async (userId) => {
    const query = `
    SELECT DISTINCT
        s.StateID as id,
        s.Country as country,
        s.State as state,
        s.CountryCode as countryCode,
        s.StateCode as stateCode
    FROM whed_state s
    LEFT JOIN whed_resp_country rc ON s.StateID = rc.StateID
    LEFT JOIN whed_resp_institution ri ON s.StateID = ri.StateID
    WHERE rc.UserID = ? OR ri.UserID = ?
    ORDER BY s.StateID DESC
  `;
    const [states] = await pool.query(query, [userId, userId]);

    if (!states || states.length === 0) {
        return [];
    }

    const stateIds = states.map(s => s.id);

    const countryQuery = `
        SELECT 
            rc.StateID as stateId,
            rc.UserID as userId,
            u.nom as editorName,
            u.login as editorLogin
        FROM whed_resp_country rc
        JOIN whed_users u ON rc.UserID = u.UserID
        WHERE rc.StateID IN (?)
    `;

    const instQuery = `
        SELECT 
            ri.StateID as stateId,
            ri.UserID as userId,
            ri.Exclusif as exclusive,
            u.nom as editorName,
            u.login as editorLogin
        FROM whed_resp_institution ri
        JOIN whed_users u ON ri.UserID = u.UserID
        WHERE ri.StateID IN (?)
    `;

    const [countryRows, instRows] = await Promise.all([
        pool.query(countryQuery, [stateIds]).then(([res]) => res),
        pool.query(instQuery, [stateIds]).then(([res]) => res)
    ]);

    const countryMap = {};
    const instMap = {};

    for (const row of countryRows) {
        if (!countryMap[row.stateId]) {
            countryMap[row.stateId] = [];
        }
        countryMap[row.stateId].push({
            userId: row.userId,
            editorName: row.editorName,
            editorLogin: row.editorLogin
        });
    }

    for (const row of instRows) {
        if (!instMap[row.stateId]) {
            instMap[row.stateId] = [];
        }
        instMap[row.stateId].push({
            userId: row.userId,
            editorName: row.editorName,
            editorLogin: row.editorLogin,
            exclusive: row.exclusive
        });
    }

    return states.map(s => ({
        ...s,
        countryResponsibilities: countryMap[s.id] || [],
        institutionResponsibilities: instMap[s.id] || []
    }));
};

const getTotalMyStates = async (userId) => {
    const query = `
    SELECT COUNT(DISTINCT s.StateID) as total
    FROM whed_state s
    LEFT JOIN whed_resp_country rc ON s.StateID = rc.StateID
    LEFT JOIN whed_resp_institution ri ON s.StateID = ri.StateID
    WHERE rc.UserID = ? OR ri.UserID = ?
  `;
    const [result] = await pool.query(query, [userId, userId]);
    return result[0].total;
};

const createMyState = async (stateData, userId) => {
    const result = await createState(stateData);
    const query = `INSERT INTO whed_resp_country (UserID, StateID) VALUES (?, ?)`;
    await pool.query(query, [userId, result.id]);
    return result;
};

export {
    createMyState, createState,
    deleteState,
    getAllStates, getMyStates, getSingleState, getTotalMyStates, getTotalStates,
    updateState
};

