import dayjs from "dayjs";

/**
 * Update Record History Log
 *
 * @param {Object} db - SQL Connection Pool
 * @param {String} tableName - Table Name
 * @param {String|Number} id - Record ID
 * @param {String} idColumn - Primary Key Column Name
 * @param {String} historyColumn - History Column Name
 * @param {String} action - e.g. "MINOR update"
 * @param {String} user - e.g. "Nicholas Poulton"
 */
async function addHistoryLogforOrg({
    db,
    tableName,
    id,
    idColumn,
    historyColumn,
    action,
    user,
}) {
    const log = `${dayjs().format("YYYY-MM-DD HH:mm:ss")} ${action} (${user})`;

    const [rows] = await db.query(
        `SELECT ${historyColumn} FROM ${tableName} WHERE ${idColumn} = ?`,
        [id]
    );

    const oldHistory = rows[0]?.[historyColumn] || "";

    const newHistory = oldHistory
        ? `${log}\n${oldHistory}`
        : log;

    await db.query(
        `UPDATE ${tableName}
         SET ${historyColumn} = ?
         WHERE ${idColumn} = ?`,
        [newHistory, id]
    );
}

export default addHistoryLogforOrg;