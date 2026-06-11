import pool from "../config/db.js";

export const checkStateResponsibility = async (req, res, next) => {
  // Admins (role 1) bypass responsibility checks
  if (req.user && req.user.role === 1) {
    return next();
  }

  // Editors (role 0) must be checked
  const userId = req.user ? (req.user.UserID) : null;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: Missing user credentials" });
  }

  try {
    let stateId = req.params.stateId || req.params.id || req.body.StateID;

    // If it is an institution request (e.g. OrgID) and stateId is an OrgID, retrieve StateID from whed_org
    const isInstitutionRoute = req.originalUrl.includes("/institute");
    if (isInstitutionRoute && req.params.id && !isNaN(req.params.id)) {
      const [orgRows] = await pool.query("SELECT StateID FROM whed_org WHERE OrgID = ?", [req.params.id]);
      if (orgRows.length > 0) {
        stateId = orgRows[0].StateID;
      }
    }

    // If it is a contact request, retrieve StateID from the contact's associated OrgID
    const isContactRoute = req.originalUrl.includes("/contact");
    if (isContactRoute) {
      if (req.params.id && !isNaN(req.params.id)) {
        const [contactRows] = await pool.query("SELECT OrgID FROM whed_contact WHERE ContactID = ?", [req.params.id]);
        if (contactRows.length > 0) {
          const [orgRows] = await pool.query("SELECT StateID FROM whed_org WHERE OrgID = ?", [contactRows[0].OrgID]);
          if (orgRows.length > 0) {
            stateId = orgRows[0].StateID;
          }
        }
      } else if (req.body.OrgID) {
        const [orgRows] = await pool.query("SELECT StateID FROM whed_org WHERE OrgID = ?", [req.body.OrgID]);
        if (orgRows.length > 0) {
          stateId = orgRows[0].StateID;
        }
      }
    }

    if (!stateId || isNaN(stateId)) {
      // If we cannot identify a stateId for validation, allow passing to controller which handles format checks
      return next();
    }

    // Check if the editor is assigned to this state
    const query = `
      SELECT StateID FROM whed_resp_country WHERE UserID = ? AND StateID = ?
      UNION
      SELECT StateID FROM whed_resp_institution WHERE UserID = ? AND StateID = ?
    `;
    const [rows] = await pool.query(query, [userId, stateId, userId, stateId]);

    if (rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: You do not have editorial rights for State ID ${stateId}`
      });
    }

    next();
  } catch (error) {
    console.error("Responsibility check middleware error:", error);
    return res.status(500).json({ success: false, message: "Server error verifying editorial assignments" });
  }
};
