import pool from '../config/db.js';

const getStatsSummary = async (year, userId, page) => {
    const tableName = `whed_stats_${year}`;

    // Verify if table exists to prevent sql errors
    const [tables] = await pool.query("SHOW TABLES LIKE ?", [tableName]);
    if (tables.length === 0) {
        return [];
    }

    let query = `
    SELECT 
        Page as page,
        COUNT(*) as hitCount,
        COUNT(DISTINCT UserID) as uniqueUsers
    FROM \`${tableName}\`
  `;
    const params = [];
    const conditions = [];

    if (userId) {
        conditions.push(`UserID = ?`);
        params.push(userId);
    }
    if (page) {
        conditions.push(`Page LIKE ?`);
        params.push(`%${page}%`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` GROUP BY Page ORDER BY hitCount DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
};

const getStatsByResource = async (year) => {
    const tableName = `whed_stats_${year}`;

    const [tables] = await pool.query("SHOW TABLES LIKE ?", [tableName]);
    if (tables.length === 0) {
        return [];
    }

    const query = `
    SELECT 
        Cible as targetId,
        Fiche as resourceName,
        Page as page,
        COUNT(*) as hitCount
    FROM \`${tableName}\`
    GROUP BY Cible, Fiche, Page
    ORDER BY hitCount DESC
  `;

    const [rows] = await pool.query(query);
    return rows;
};

const logManualHit = async (hitData) => {
    const { pageType, targetId, ficheName, ip, host, userId, userName } = hitData;
    const year = new Date().getFullYear();
    const tableName = `whed_stats_${year}`;

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS \`${tableName}\` (
      IP varchar(45) NULL,
      HOST varchar(255) NULL,
      Page varchar(255) NULL,
      UserID int DEFAULT 0,
      Nom varchar(255) NULL,
      Cible varchar(50) NULL,
      Fiche varchar(255) NULL,
      DateSearch datetime DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
    await pool.query(createTableQuery);

    const query = `
    INSERT INTO \`${tableName}\` (IP, HOST, Page, UserID, Nom, Cible, Fiche) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    const [result] = await pool.query(query, [
        ip, 
        host, 
        pageType, 
        userId, 
        userName, 
        targetId, 
        ficheName || `${pageType} Profile Hit`
    ]);
    return { success: true };
};

export {
    getStatsByResource,
    getStatsSummary,
    logManualHit
};
