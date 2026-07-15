import pool from "../config/db.js";

export const checkStateResponsibility = async (req, res, next) => {

  // admin user passed directly
  if (req.user && req.user.role === 1) {
    return next();
  }

  // user Id Check
  const userId = req.user ? req.user.UserID : null;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: Missing User Access Credentials" });
  }



  try {
    let stateId = req.params.stateId || req.params.id || req.body.StateID;
    const idIsNumber = /^\d+$/.test(req.params.id);

    const originalUrl = req.originalUrl;


    // get StateID for Institute route
    if (originalUrl.includes("/institute") && req.params.id && idIsNumber) {
      const [orgRows] = await pool.query("SELECT StateID FROM whed_org WHERE OrgID = ?", [req.params.id]);
      if (orgRows.length > 0) {
        stateId = orgRows[0].StateID;
      }
    }

    // get StateID for Credential route
    if (originalUrl.includes("/credential") && req.params.id && idIsNumber) {
      const [credRows] = await pool.query("SELECT StateID FROM whed_cred WHERE CredID = ?", [req.params.id]);
      if (credRows.length > 0) {
        stateId = credRows[0].StateID;
      }
    }

    // ৪. কন্টাক্ট রাউটের জন্য JOIN ব্যবহার করে ১টি কোয়েরিতে StateID বের করা (Performance Optimization)
    if (originalUrl.includes("/contact")) {
      if (req.params.id && idIsNumber) {
        const queryContact = `
          SELECT o.StateID 
          FROM whed_contact c
          JOIN whed_org o ON c.OrgID = o.OrgID
          WHERE c.ContactID = ?
        `;
        const [contactRows] = await pool.query(queryContact, [req.params.id]);
        if (contactRows.length > 0) {
          stateId = contactRows[0].StateID;
        }
      } else if (req.body.OrgID) {
        const [orgRows] = await pool.query("SELECT StateID FROM whed_org WHERE OrgID = ?", [req.body.OrgID]);
        if (orgRows.length > 0) {
          stateId = orgRows[0].StateID;
        }
      }
    }

    // security check : if not found the StateID
    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({ success: false, message: "Bad Request: Unable to identify State ID for verification" });
    }

    // Permission check for edit
    const checkQuery = `
      SELECT StateID FROM whed_resp_country WHERE UserID = ? AND StateID = ?
      UNION
      SELECT StateID FROM whed_resp_institution WHERE UserID = ? AND StateID = ?
    `;
    const [rows] = await pool.query(checkQuery, [userId, stateId, userId, stateId]);

    if (rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: You do not have editorial rights for State ID ${stateId}`
      });
    }


    // Finally go to next middleware
    next();
  } catch (error) {
    console.error("Responsibility check middleware error:", error);
    return res.status(500).json({ success: false, message: "Server error verifying editorial assignments" });
  }
};