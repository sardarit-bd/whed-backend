import pool from "../config/db.js";

export const logProfileHit = (pageType) => async (req, res, next) => {
    // Proceed with the request first
    next();

    // After response is sent, asynchronously log in the background
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
        const host = req.headers["host"] || "";
        const page = req.originalUrl || "";
        const userId = req.user ? req.user.id : 0;
        const userName = req.user ? req.user.name : "Guest";
        const targetId = req.params.id || req.params.stateId || "";

        const year = new Date().getFullYear();
        const tableName = `whed_stats_${year}`;

        // Ensure table exists for the current year
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

        // Perform insert
        const insertQuery = `
      INSERT INTO \`${tableName}\` (IP, HOST, Page, UserID, Nom, Cible, Fiche) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        await pool.query(insertQuery, [
            ip, 
            host, 
            page, 
            userId, 
            userName, 
            targetId, 
            `${pageType} Profile Hit`
        ]);
    } catch (error) {
        console.error("Traffic Statistics Logging Failed:", error.message);
    }
};
