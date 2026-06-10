import pool from '../config/db.js';

const getAllInstitutes = async (limit, offset, filters = {}) => {
    const { stateId, countryCode, fundingType, search } = filters;
    let query = `
    SELECT 
        OrgID as id,
        OrgName as name,
        InstNameEnglish as nameInEnglish,
        City as city,
        CountryCode as countryCode,
        InstFundingTypeCode as fundingType,
        StateID as stateId
    FROM whed_org
  `;
    const params = [];
    const conditions = [];

    if (stateId) {
        conditions.push(`StateID = ?`);
        params.push(stateId);
    }
    if (countryCode) {
        conditions.push(`CountryCode = ?`);
        params.push(countryCode);
    }
    if (fundingType) {
        conditions.push(`InstFundingTypeCode = ?`);
        params.push(fundingType);
    }
    if (search) {
        conditions.push(`(OrgName LIKE ? OR InstNameEnglish LIKE ?)`);
        params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY OrgID DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

const getSingleInstitute = async (id) => {
    const query = `
    SELECT 
        OrgID as id,
        GlobalID,
        iParentOrgID,
        AliasID,
        Family,
        OrgName as name,
        iBranchName as branchof,
        InstNameEnglish as nameInEnglish,
        iBranchNameEnglish,
        CountryCode,
        StateCode,
        StateID,
        BranchID,
        OrgTypeCode as typeofInstitute,
        InstNameAlt as alternativeName,
        InstAcronym as acronym,
        InstClassCode,
        InstFundingTypeCode,
        iIAUMembershipOption as iauMembership,
        iIAULogo as logo,
        iIAUNews as news,
        iAAUMembershipOption,
        iOtherSites,
        iHistory,
        iAdmissionRequirements as admissionrequirements,
        iFeesN as tuitionfees,
        iFeesNCurrencyCode,
        iFeesI,
        iFeesICurrencyCode,
        iAcademicYear,
        iLanguagesUsed as languageofinstruction,
        iLibrary,
        iMainPress,
        iResidentialFacilities,
        iCreated as yearofcreation,
        iPresentStatusYear,
        iStudentTotal as nationalstudents,
        iStudentForeignTotal as internationalstudents,
        iAccreditingAgency as nameofyournationalcompetentaccreditationbody,
        iAccreditationEndDate as dateoftheaccreditationlastused,
        ReligionCode as religion,
        iStudentBody as studentbody,
        DPName as fullName,
        DPEMail as contactemail,
        Street as street,
        City as city,
        Province as province,
        PostCode as postalCode,
        Tel as tel,
        Fax as fax,
        EMail as email,
        WWW as website
    FROM whed_org
    WHERE OrgID = ?
  `;
    const [rows] = await pool.query(query, [id]);
    const institute = rows[0];
    if (!institute) return null;

    // Fetch related faculties (divisions)
    const [divisions] = await pool.query(`
      SELECT 
        iDivisionID as id, 
        iDivision as name, 
        iDivisionTypeCode as typeCode, 
        iMoreDetails as moreDetails 
      FROM whed_division 
      WHERE OrgID = ?
    `, [id]);

    // Fetch related degrees
    const [degrees] = await pool.query(`
      SELECT 
        d.iDegreeID as id, 
        d.iDegree as name, 
        d.CredID as credId, 
        c.Cred as credentialName, 
        d.iDegreeOrigine as originalTitle, 
        d.iDegreeNote as note 
      FROM whed_degree d
      LEFT JOIN whed_cred c ON d.CredID = c.CredID
      WHERE d.OrgID = ?
    `, [id]);

    return {
        ...institute,
        divisions,
        degrees
    };
};

const createInstitute = async (instituteData) => {
    // Map form fields to whed_org schema columns
    const mappedData = {};
    if (instituteData.name) mappedData.OrgName = instituteData.name;
    if (instituteData.nameInEnglish) mappedData.InstNameEnglish = instituteData.nameInEnglish;
    if (instituteData.branchof) mappedData.iBranchName = instituteData.branchof;
    if (instituteData.acronym) mappedData.InstAcronym = instituteData.acronym;
    if (instituteData.street) mappedData.Street = instituteData.street;
    if (instituteData.city) mappedData.City = instituteData.city;
    if (instituteData.province) mappedData.Province = instituteData.province;
    if (instituteData.postalCode) mappedData.PostCode = instituteData.postalCode;
    if (instituteData.tel) mappedData.Tel = instituteData.tel;
    if (instituteData.fax) mappedData.Fax = instituteData.fax;
    if (instituteData.email) mappedData.EMail = instituteData.email;
    if (instituteData.website) mappedData.WWW = instituteData.website;
    if (instituteData.logo) mappedData.iLogo = instituteData.logo;
    if (instituteData.typeofInstitute) mappedData.OrgTypeCode = instituteData.typeofInstitute;
    if (instituteData.religion) mappedData.ReligionCode = instituteData.religion;
    if (instituteData.news) mappedData.iIAUNews = instituteData.news;
    if (instituteData.yearofcreation) mappedData.iCreated = String(instituteData.yearofcreation);
    if (instituteData.admissionrequirements) mappedData.iAdmissionRequirements = instituteData.admissionrequirements;
    if (instituteData.tuitionfees) mappedData.iFeesN = instituteData.tuitionfees;
    if (instituteData.nationalstudents) mappedData.iStudentTotal = instituteData.nationalstudents;
    if (instituteData.internationalstudents) mappedData.iStudentForeignTotal = instituteData.internationalstudents;
    if (instituteData.languageofinstruction) mappedData.iLanguagesUsed = instituteData.languageofinstruction;
    if (instituteData.nameofyournationalcompetentaccreditationbody) mappedData.iAccreditingAgency = instituteData.nameofyournationalcompetentaccreditationbody;
    if (instituteData.dateoftheaccreditationlastused) mappedData.iAccreditationEndDate = String(instituteData.dateoftheaccreditationlastused);
    if (instituteData.studentbody) mappedData.iStudentBody = instituteData.studentbody;

    // State & Classifications
    if (instituteData.StateID) mappedData.StateID = instituteData.StateID;
    if (instituteData.CountryCode) mappedData.CountryCode = instituteData.CountryCode;
    if (instituteData.StateCode) mappedData.StateCode = instituteData.StateCode;
    if (instituteData.fundingType) mappedData.InstFundingTypeCode = instituteData.fundingType;
    if (instituteData.classCode) mappedData.InstClassCode = instituteData.classCode;

    // Officers
    if (instituteData.fullName) mappedData.DPName = instituteData.fullName;
    if (instituteData.contactemail) mappedData.DPEMail = instituteData.contactemail;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const keys = Object.keys(mappedData);
        const values = Object.values(mappedData);

        if (keys.length === 0) {
            throw new Error("No valid institute fields provided");
        }

        const placeholders = keys.map(() => "?").join(", ");
        const columns = keys.join(", ");
        const query = `INSERT INTO whed_org (${columns}) VALUES (${placeholders})`;

        const [result] = await connection.query(query, values);
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

const ALLOWED_ORG_FIELDS = new Set([
    "GlobalID", "iParentOrgID", "AliasID", "Family", "OrgName", "iBranchName",
    "InstNameEnglish", "iBranchNameEnglish", "CountryCode", "StateCode", "StateID",
    "BranchID", "OrgTypeCode", "InstNameAlt", "InstAcronym", "InstClassCode",
    "InstFundingTypeCode", "iIAUMembershipOption", "iIAULogo", "iIAUNews",
    "iAAUMembershipOption", "iOtherSites", "iHistory", "iAdmissionRequirements",
    "iFeesN", "iFeesNCurrencyCode", "iFeesI", "iFeesICurrencyCode", "iAcademicYear",
    "iLanguagesUsed", "iLibrary", "iMainPress", "iResidentialFacilities", "iCreated",
    "iPresentStatusYear", "iStaffStatisticsYear", "iStaffStatisticsApprox", "iStaffFullTimeTotal",
    "iStaffFullTimeMale", "iStaffFullTimeFemale", "iStaffPartTimeTotal", "iStaffPartTimeFemale",
    "iStaffPartTimeMale", "iStaffDocFullTimeTotal", "iStaffDocFullTimeMale", "iStaffDocFullTimeFemale",
    "iStudentStatisticsYear", "iStudentStatisticsApprox", "iStudentTotal", "iStudentMale",
    "iStudentFemale", "iStudentForeignTotal", "iStudentForeignMale", "iStudentForeignFemale",
    "iStudentPartTime", "iStudentDistance", "iStudentsDisabilities", "iAccreditingAgency",
    "iAccreditationEndDate", "sInstTypeID", "ReligionCode", "iStudentBody",
    "iSSAcademicCounselling", "iSSSocialCounselling", "iSSCareersAdvices", "iSSNurseryCare",
    "iSSCulturalActivities", "iSSSportsFacilities", "iSSLanguageLaboratory", "iSSDisabledFacilities",
    "iSSHealthServices", "iSSCanteen", "iSSLibrary", "iSSeLibrary", "iSSResidentialFacilities",
    "iSSITCentre", "iSSForeignStudiesCentre", "iSSOnlineDistanceLearning", "iDegreeNote",
    "iRecordHistory", "iInputDate", "iMajorUpdateDate", "iMinorUpdateDate", "iMajorUpdateDateDP",
    "Street", "City", "Province", "PostCode", "Tel", "Fax", "EMail", "WWW", "UserID",
    "iWarning", "iDelete", "DPTypeContact", "DPName", "DPEMail", "DPEMailCopie", "DPStatus",
    "DPFlag", "DPControle", "DPDateEnvoi", "DPDateLimite", "DPDateAcces", "DPDateModif",
    "DPDateRelance", "DPDateRetour", "DPDateValid", "DPNbrRelance", "DPHistRelance",
    "iUpdate", "iLearning", "iLogo", "iWebUpdateDate", "iComment", "iPartnership",
    "DateAccredited", "iOther", "iInstClassHistory"
]);

const updateInstitute = async (id, updateData) => {
    // Whitelist and sanitize fields to prevent SQL column name injection
    const keys = Object.keys(updateData).filter(key => ALLOWED_ORG_FIELDS.has(key));

    if (keys.length === 0) {
        return { affectedRows: 0 };
    }

    const values = keys.map(key => updateData[key]);

    // Construct dynamic SQL query with SET clause
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE whed_org SET ${setClause} WHERE OrgID = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
};

const deleteInstitute = async (id) => {
    const query = `DELETE FROM whed_org WHERE OrgID = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

const getTotalInstitutes = async (filters = {}) => {
    const { stateId, countryCode, fundingType, search } = filters;
    let query = 'SELECT COUNT(*) as total FROM whed_org';
    const params = [];
    const conditions = [];

    if (stateId) {
        conditions.push(`StateID = ?`);
        params.push(stateId);
    }
    if (countryCode) {
        conditions.push(`CountryCode = ?`);
        params.push(countryCode);
    }
    if (fundingType) {
        conditions.push(`InstFundingTypeCode = ?`);
        params.push(fundingType);
    }
    if (search) {
        conditions.push(`(OrgName LIKE ? OR InstNameEnglish LIKE ?)`);
        params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    const [result] = await pool.query(query, params);
    return result[0].total;
};

const getDetailedInstitutesByState = async (limit, offset, stateId, filters = {}) => {
    const { countryCode, fundingType, search } = filters;
    let query = `
    SELECT 
        OrgID as id,
        GlobalID,
        iParentOrgID,
        AliasID,
        Family,
        OrgName as name,
        iBranchName as branchof,
        InstNameEnglish as nameInEnglish,
        iBranchNameEnglish,
        CountryCode,
        StateCode,
        StateID,
        BranchID,
        OrgTypeCode as typeofInstitute,
        InstNameAlt as alternativeName,
        InstAcronym as acronym,
        InstClassCode,
        InstFundingTypeCode,
        iIAUMembershipOption as iauMembership,
        iIAULogo as logo,
        iIAUNews as news,
        iAAUMembershipOption,
        iOtherSites,
        iHistory,
        iAdmissionRequirements as admissionrequirements,
        iFeesN as tuitionfees,
        iFeesNCurrencyCode,
        iFeesI,
        iFeesICurrencyCode,
        iAcademicYear,
        iLanguagesUsed as languageofinstruction,
        iLibrary,
        iMainPress,
        iResidentialFacilities,
        iCreated as yearofcreation,
        iPresentStatusYear,
        iStudentTotal as nationalstudents,
        iStudentForeignTotal as internationalstudents,
        iAccreditingAgency as nameofyournationalcompetentaccreditationbody,
        iAccreditationEndDate as dateoftheaccreditationlastused,
        ReligionCode as religion,
        iStudentBody as studentbody,
        DPName as fullName,
        DPEMail as contactemail,
        Street as street,
        City as city,
        Province as province,
        PostCode as postalCode,
        Tel as tel,
        Fax as fax,
        EMail as email,
        WWW as website
    FROM whed_org
    WHERE StateID = ?
  `;
    const params = [stateId];
    
    if (countryCode) {
        query += ` AND CountryCode = ?`;
        params.push(countryCode);
    }
    if (fundingType) {
        query += ` AND InstFundingTypeCode = ?`;
        params.push(fundingType);
    }
    if (search) {
        query += ` AND (OrgName LIKE ? OR InstNameEnglish LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY OrgID DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    if (rows.length === 0) return [];

    const orgIds = rows.map(r => r.id);

    // Fetch related divisions
    const [divisions] = await pool.query(`
      SELECT 
        iDivisionID as id, 
        iDivision as name, 
        iDivisionTypeCode as typeCode, 
        iMoreDetails as moreDetails,
        OrgID
      FROM whed_division 
      WHERE OrgID IN (?)
    `, [orgIds]);

    // Fetch related degrees
    const [degrees] = await pool.query(`
      SELECT 
        d.iDegreeID as id, 
        d.iDegree as name, 
        d.CredID as credId, 
        c.Cred as credentialName, 
        d.iDegreeOrigine as originalTitle, 
        d.iDegreeNote as note,
        d.OrgID
      FROM whed_degree d
      LEFT JOIN whed_cred c ON d.CredID = c.CredID
      WHERE d.OrgID IN (?)
    `, [orgIds]);

    const divisionsMap = {};
    const degreesMap = {};
    orgIds.forEach(id => {
        divisionsMap[id] = [];
        degreesMap[id] = [];
    });

    divisions.forEach(div => {
        if (divisionsMap[div.OrgID]) {
            divisionsMap[div.OrgID].push({
                id: div.id,
                name: div.name,
                typeCode: div.typeCode,
                moreDetails: div.moreDetails
            });
        }
    });

    degrees.forEach(deg => {
        if (degreesMap[deg.OrgID]) {
            degreesMap[deg.OrgID].push({
                id: deg.id,
                name: deg.name,
                credId: deg.credId,
                credentialName: deg.credentialName,
                originalTitle: deg.originalTitle,
                note: deg.note
            });
        }
    });

    return rows.map(row => ({
        ...row,
        divisions: divisionsMap[row.id] || [],
        degrees: degreesMap[row.id] || []
    }));
};

export { createInstitute, deleteInstitute, getAllInstitutes, getSingleInstitute, getDetailedInstitutesByState, getTotalInstitutes, updateInstitute };

