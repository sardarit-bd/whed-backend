import pool from '../config/db.js';

const ALLOWED_COUNTRY_FIELDS = new Set([
    "Country", "CountryCode", "StateAlpha", 
    "ProxyStateID", "Palgrave", "UseCountryCreds", "EdSysLocked", 
    "InstLocked", "Stub", "CredLocked", "Regions", "ISO3", "Public"
]);

const getAllCountries = async (limit, offset) => {
    const query = `
    SELECT 
        StateID as id,
        Country as country,
        CountryCode as countryCode,
        StateAlpha as stateAlpha,
        Regions as regions,
        ISO3 as iso3,
        Public as public
    FROM whed_state
    WHERE State IS NULL OR State = '' OR StateCode IS NULL OR StateCode = ''
    ORDER BY StateID DESC
    LIMIT ? OFFSET ?
  `;
    const [rows] = await pool.query(query, [limit, offset]);
    return rows;
};

const getTotalCountries = async () => {
    const [result] = await pool.query("SELECT COUNT(*) as total FROM whed_state WHERE State IS NULL OR State = '' OR StateCode IS NULL OR StateCode = ''");
    return result[0].total;
};

const getSingleCountry = async (id) => {
    const query = `
    SELECT 
        StateID as id,
        Country as country,
        CountryCode as countryCode,
        StateAlpha as stateAlpha,
        ProxyStateID as proxyStateId,
        Palgrave as palgrave,
        UseCountryCreds as useCountryCreds,
        EdSysLocked as edSysLocked,
        InstLocked as instLocked,
        Stub as stub,
        CredLocked as credLocked,
        Regions as regions,
        ISO3 as iso3,
        Public as public
    FROM whed_state
    WHERE StateID = ? AND (State IS NULL OR State = '' OR StateCode IS NULL OR StateCode = '')
  `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};

const createCountry = async (countryData) => {
    // Whitelist keys to prevent SQL column injection
    const keys = Object.keys(countryData).filter(key => ALLOWED_COUNTRY_FIELDS.has(key));
    const values = keys.map(key => countryData[key]);

    // Force State and StateCode to be empty to denote a country
    keys.push("State");
    values.push("");
    keys.push("StateCode");
    values.push("");

    if (keys.length === 0) {
        throw new Error("No valid country fields provided");
    }

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");
    const query = `INSERT INTO whed_state (${columns}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);
    return { id: result.insertId };
};

const updateCountry = async (id, updateData) => {
    // Whitelist keys to prevent SQL column injection
    const keys = Object.keys(updateData).filter(key => ALLOWED_COUNTRY_FIELDS.has(key));

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_state SET ${setClause} WHERE StateID = ? AND (State IS NULL OR State = '' OR StateCode IS NULL OR StateCode = '')`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
};

const deleteCountry = async (id) => {
    const query = `DELETE FROM whed_state WHERE StateID = ? AND (State IS NULL OR State = '' OR StateCode IS NULL OR StateCode = '')`;
    const [result] = await pool.query(query, [id]);
    return result;
};

export { createCountry, deleteCountry, getAllCountries, getSingleCountry, getTotalCountries, updateCountry };
