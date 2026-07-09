import pool from '../config/db.js';
import addHistoryLogforOrg from '../utils/addHistoryLogforOrg.js';

const getAllInstitutes = async (filters = {}) => {
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

    query += ` ORDER BY OrgID DESC`;

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
        WWW as website,
        iLearning,
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



    // --- Notun add kora holo: Periodicals fetch korar jonno ---
    const [periodicals] = await pool.query(`
      SELECT 
        iPeriodicalID as id,
        iPeriodical as name
      FROM whed_periodical
      WHERE OrgID = ?
    `, [id]);


    return {
        ...institute,
        divisions,
        degrees,
        periodicals
    };
};

const createInstitute = async (instituteData, stateId, user) => {


    //  get all state Information by stateID Frist
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
    const [rows] = await pool.query(query, [stateId]);
    const stateInfo = rows[0];


    const mappedData = {};

    // ==========================================
    mappedData.UserID = user ? user.UserID : null;
    mappedData.OrgName = instituteData.OrgName ? instituteData.OrgName.trim() : '';
    mappedData.InstNameEnglish = instituteData.OrgName ? instituteData.OrgName.trim() : '';
    mappedData.iBranchName = instituteData.branchof ? instituteData.branchof.trim() : '';
    mappedData.iBranchNameEnglish = instituteData.branchof ? instituteData.branchof.trim() : '';
    mappedData.iRecordHistory = instituteData.recordHistory ? instituteData.recordHistory.trim() : '';
    mappedData.iInstClassHistory = instituteData.iInstClassHistory ? instituteData.iInstClassHistory.trim() : '';

    // ==========================================
    if (instituteData.GlobalID) mappedData.GlobalID = instituteData.GlobalID.trim();
    if (instituteData.iParentOrgID) mappedData.iParentOrgID = parseInt(instituteData.iParentOrgID, 10);
    if (instituteData.AliasID !== undefined) mappedData.AliasID = parseInt(instituteData.AliasID, 10);
    if (instituteData.Family !== undefined) mappedData.Family = parseInt(instituteData.Family, 10);
    if (instituteData.BranchID) mappedData.BranchID = parseInt(instituteData.BranchID, 10);
    if (instituteData.UserID) mappedData.UserID = parseInt(instituteData.UserID, 10);


    if (stateInfo) mappedData.StateID = parseInt(stateInfo?.id, 10);
    if (stateInfo) mappedData.CountryCode = stateInfo?.countryCode;
    if (stateInfo) mappedData.StateCode = stateInfo?.stateCode;

    if (instituteData.typeofInstitute) mappedData.OrgTypeCode = instituteData.typeofInstitute.trim();
    if (instituteData.classCode) mappedData.InstClassCode = instituteData.classCode.trim();
    if (instituteData.fundingType) mappedData.InstFundingTypeCode = instituteData.fundingType.trim();
    if (instituteData.religion) mappedData.ReligionCode = instituteData.religion.trim();

    // ==========================================
    // ৩. মেম্বারশিপ, মিডিয়া এবং টেক্সট ফিল্ডস
    // ==========================================
    if (instituteData.acronym) mappedData.InstAcronym = instituteData.acronym.trim();
    if (instituteData.alternativeName) mappedData.InstNameAlt = instituteData.alternativeName.trim();
    if (instituteData.iauMembershipOption !== undefined) mappedData.iIAUMembershipOption = parseInt(instituteData.iauMembershipOption, 10);
    if (instituteData.iauLogo) mappedData.iIAULogo = instituteData.iauLogo.trim();
    if (instituteData.news) mappedData.iIAUNews = instituteData.news.trim();
    if (instituteData.aauMembershipOption !== undefined) mappedData.iAAUMembershipOption = parseInt(instituteData.aauMembershipOption, 10);
    if (instituteData.otherSites) mappedData.iOtherSites = instituteData.otherSites.trim();
    if (instituteData.history) mappedData.iHistory = instituteData.history.trim();
    if (instituteData.admissionrequirements) mappedData.iAdmissionRequirements = instituteData.admissionrequirements.trim();
    if (instituteData.tuitionfees) mappedData.iFeesN = instituteData.tuitionfees.trim();
    if (instituteData.feesNCurrencyCode) mappedData.iFeesNCurrencyCode = instituteData.feesNCurrencyCode.trim();
    if (instituteData.feesI) mappedData.iFeesI = instituteData.feesI.trim();
    if (instituteData.feesICurrencyCode) mappedData.iFeesICurrencyCode = instituteData.feesICurrencyCode.trim();
    if (instituteData.academicYear) mappedData.iAcademicYear = instituteData.academicYear.trim();
    if (instituteData.languageofinstruction) mappedData.iLanguagesUsed = instituteData.languageofinstruction.trim();
    if (instituteData.library) mappedData.iLibrary = instituteData.library.trim();
    if (instituteData.mainPress) mappedData.iMainPress = instituteData.mainPress.trim();
    if (instituteData.residentialFacilities) mappedData.iResidentialFacilities = instituteData.residentialFacilities.trim();
    if (instituteData.yearofcreation) mappedData.iCreated = String(instituteData.yearofcreation).trim();
    if (instituteData.presentStatusYear) mappedData.iPresentStatusYear = instituteData.presentStatusYear.trim();
    if (instituteData.degreeNote) mappedData.iDegreeNote = instituteData.degreeNote.trim();
    if (instituteData.comment) mappedData.iComment = instituteData.comment.trim();
    if (instituteData.partnership) mappedData.iPartnership = instituteData.partnership.trim();
    if (instituteData.instClassHistory) mappedData.iInstClassHistory = instituteData.instClassHistory ? instituteData.instClassHistory.trim() : '';

    // ==========================================
    // ৪. স্টাফ স্ট্যাটিস্টিকস (Staff Stats)
    // ==========================================
    if (instituteData.staffStatisticsYear) mappedData.iStaffStatisticsYear = instituteData.staffStatisticsYear.trim();
    if (instituteData.staffStatisticsApprox !== undefined) mappedData.iStaffStatisticsApprox = instituteData.staffStatisticsApprox ? 1 : 0;
    if (instituteData.staffFullTimeTotal !== undefined) mappedData.iStaffFullTimeTotal = parseInt(instituteData.staffFullTimeTotal, 10);
    if (instituteData.staffFullTimeMale !== undefined) mappedData.iStaffFullTimeMale = parseInt(instituteData.staffFullTimeMale, 10);
    if (instituteData.staffFullTimeFemale !== undefined) mappedData.iStaffFullTimeFemale = parseInt(instituteData.staffFullTimeFemale, 10);
    if (instituteData.staffPartTimeTotal !== undefined) mappedData.iStaffPartTimeTotal = parseInt(instituteData.staffPartTimeTotal, 10);
    if (instituteData.staffPartTimeFemale !== undefined) mappedData.iStaffPartTimeFemale = parseInt(instituteData.staffPartTimeFemale, 10);
    if (instituteData.staffPartTimeMale !== undefined) mappedData.iStaffPartTimeMale = parseInt(instituteData.staffPartTimeMale, 10);
    if (instituteData.staffDocFullTimeTotal !== undefined) mappedData.iStaffDocFullTimeTotal = parseInt(instituteData.staffDocFullTimeTotal, 10);
    if (instituteData.staffDocFullTimeMale !== undefined) mappedData.iStaffDocFullTimeMale = parseInt(instituteData.staffDocFullTimeMale, 10);
    if (instituteData.staffDocFullTimeFemale !== undefined) mappedData.iStaffDocFullTimeFemale = parseInt(instituteData.staffDocFullTimeFemale, 10);

    // ==========================================
    // ৫. স্টুডেন্ট স্ট্যাটিস্টিকস (Student Stats)
    // ==========================================
    if (instituteData.studentStatisticsYear) mappedData.iStudentStatisticsYear = instituteData.studentStatisticsYear.trim();
    if (instituteData.studentStatisticsApprox !== undefined) mappedData.iStudentStatisticsApprox = instituteData.studentStatisticsApprox ? 1 : 0;
    if (instituteData.nationalstudents !== undefined) mappedData.iStudentTotal = parseInt(instituteData.nationalstudents, 10);
    if (instituteData.studentMale !== undefined) mappedData.iStudentMale = parseInt(instituteData.studentMale, 10);
    if (instituteData.studentFemale !== undefined) mappedData.iStudentFemale = parseInt(instituteData.studentFemale, 10);
    if (instituteData.internationalstudents !== undefined) mappedData.iStudentForeignTotal = parseInt(instituteData.internationalstudents, 10);
    if (instituteData.studentForeignMale !== undefined) mappedData.iStudentForeignMale = parseInt(instituteData.studentForeignMale, 10);
    if (instituteData.studentForeignFemale !== undefined) mappedData.iStudentForeignFemale = parseInt(instituteData.studentForeignFemale, 10);
    if (instituteData.studentPartTime !== undefined) mappedData.iStudentPartTime = parseInt(instituteData.studentPartTime, 10);
    if (instituteData.studentDistance !== undefined) mappedData.iStudentDistance = parseInt(instituteData.studentDistance, 10);
    if (instituteData.studentsDisabilities !== undefined) mappedData.iStudentsDisabilities = parseInt(instituteData.studentsDisabilities, 10);

    // ==========================================
    // ৬. অ্যাক্রেডিটেশন ও এফিলিয়েশন
    // ==========================================
    if (instituteData.nameofyournationalcompetentaccreditationbody) mappedData.iAccreditingAgency = instituteData.nameofyournationalcompetentaccreditationbody.trim();
    if (instituteData.dateoftheaccreditationlastused) mappedData.iAccreditationEndDate = String(instituteData.dateoftheaccreditationlastused).trim();
    if (instituteData.dateAccredited) mappedData.DateAccredited = instituteData.dateAccredited.trim();
    if (instituteData.sInstTypeID) mappedData.sInstTypeID = parseInt(instituteData.sInstTypeID, 10);
    if (instituteData.studentbody) mappedData.iStudentBody = instituteData.studentbody.trim();

    // ==========================================
    // ৭. স্টুডেন্ট সার্ভিস ফ্ল্যাগস (iSS Fields)
    // ==========================================
    const issFields = [
        'iSSAcademicCounselling', 'iSSSocialCounselling', 'iSSCareersAdvices',
        'iSSNurseryCare', 'iSSCulturalActivities', 'iSSSportsFacilities',
        'iSSLanguageLaboratory', 'iSSDisabledFacilities', 'iSSHealthServices',
        'iSSCanteen', 'iSSLibrary', 'iSSeLibrary', 'iSSResidentialFacilities',
        'iSSITCentre', 'iSSForeignStudiesCentre', 'iSSOnlineDistanceLearning'
    ];
    issFields.forEach(field => {
        // ফ্রন্টএন্ড থেকে উটের পিঠের মতো (camelCase) নাম আশা করা হচ্ছে (যেমন: iSSAcademicCounselling -> academicCounselling)
        const frontendKey = field.charAt(3).toLowerCase() + field.slice(4);
        if (instituteData[frontendKey] !== undefined) {
            mappedData[field] = instituteData[frontendKey] ? 1 : 0;
        }
    });

    // ==========================================
    // ৮. কন্টাক্ট এবং অ্যাড্রেস
    // ==========================================
    if (instituteData.street) mappedData.Street = instituteData.street.trim();
    if (instituteData.city) mappedData.City = instituteData.city.trim();
    if (instituteData.province) mappedData.Province = instituteData.province.trim();
    if (instituteData.postalCode) mappedData.PostCode = instituteData.postalCode.trim();
    if (instituteData.tel) mappedData.Tel = instituteData.tel.trim();
    if (instituteData.fax) mappedData.Fax = instituteData.fax.trim();
    if (instituteData.email) mappedData.EMail = instituteData.email.trim();
    if (instituteData.website) mappedData.WWW = instituteData.website.trim();
    if (instituteData.logo) mappedData.iLogo = instituteData.logo.trim();

    // ==========================================
    // ৯. সিস্টেম ফ্ল্যাগস ও ডেটা প্রসেসিং (DP) ট্র্যাকিং
    // ==========================================
    if (instituteData.iWarning !== undefined) mappedData.iWarning = parseInt(instituteData.iWarning, 10);
    if (instituteData.iDelete !== undefined) mappedData.iDelete = parseInt(instituteData.iDelete, 10);
    if (instituteData.iUpdate !== undefined) mappedData.iUpdate = parseInt(instituteData.iUpdate, 10);
    if (instituteData.iLearning !== undefined) mappedData.iLearning = parseInt(instituteData.iLearning, 10);
    if (instituteData.iOther !== undefined) mappedData.iOther = parseInt(instituteData.iOther, 10);

    if (instituteData.dpTypeContact !== undefined) mappedData.DPTypeContact = parseInt(instituteData.dpTypeContact, 10);
    if (instituteData.fullName) mappedData.DPName = instituteData.fullName.trim();
    if (instituteData.contactemail) mappedData.DPEMail = instituteData.contactemail.trim();
    if (instituteData.dpEmailCopie) mappedData.DPEMailCopie = instituteData.dpEmailCopie.trim();
    if (instituteData.dpStatus !== undefined) mappedData.DPStatus = parseInt(instituteData.dpStatus, 10);
    if (instituteData.dpFlag !== undefined) mappedData.DPFlag = parseInt(instituteData.dpFlag, 10);
    if (instituteData.dpControle) mappedData.DPControle = instituteData.dpControle.trim();
    if (instituteData.dpHistRelance) mappedData.DPHistRelance = instituteData.dpHistRelance.trim();





    // DP Unix Epoch Timestamps
    const dpTimestamps = [
        'DPDateEnvoi', 'DPDateLimite', 'DPDateAcces', 'DPDateModif',
        'DPDateRelance', 'DPDateRetour', 'DPDateValid', 'DPNbrRelance'
    ];
    dpTimestamps.forEach(tsField => {
        const frontendTsKey = tsField.charAt(0).toLowerCase() + tsField.slice(1);
        if (instituteData[frontendTsKey] !== undefined) {
            mappedData[tsField] = parseInt(instituteData[frontendTsKey], 10);
        }
    });

    // ==========================================
    // ১০. সিস্টেম ডেট অ্যান্ড টাইমস্ট্যাম্পস
    // ==========================================
    // ইনসার্ট এর সময় কারেন্ট টাইম স্ট্যাম্প সেট করা হচ্ছে
    mappedData.iInputDate = new Date();
    mappedData.iWebUpdateDate = new Date();



    // ==========================================
    // ১১. ডাটাবেজ ট্রানজেকশন এক্সিকিউশন
    // ==========================================
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const keys = Object.keys(mappedData);
        const values = Object.values(mappedData);

        if (keys.length === 0) {
            throw new Error("No valid fields provided for database insertion.");
        }

        const placeholders = keys.map(() => "?").join(", ");
        const columns = keys.join(", ");
        const query = `INSERT INTO whed_org (${columns}) VALUES (${placeholders})`;

        const [result] = await connection.query(query, values);


        const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;

        const globalId = `IAU-${String(insertId).padStart(6, "0")}`;

        await connection.query(
            `UPDATE whed_org
                SET GlobalID = ?
                WHERE OrgID = ?`,
            [globalId, insertId]
        );


        await connection.commit();


        return { id: insertId || null };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Database Service Transaction Error:", error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }


};

const ALLOWED_ORG_FIELDS = new Set([
    "iParentOrgID",
    "AliasID",
    "Family",
    "OrgName",
    "iBranchName",
    "InstNameEnglish",
    "iBranchNameEnglish",
    "iRecordHistory",
    "BranchID",
    "OrgTypeCode",
    "InstNameAlt",
    "InstAcronym",
    "InstClassCode",
    "InstFundingTypeCode",
    "iIAUMembershipOption",
    "iIAULogo",
    "iIAUNews",
    "iAAUMembershipOption",
    "iOtherSites",
    "iHistory",
    "iAdmissionRequirements",
    "iFeesN",
    "iFeesNCurrencyCode",
    "iFeesI",
    "iFeesICurrencyCode",
    "iAcademicYear",
    "iLanguagesUsed",
    "iLibrary",
    "iMainPress",
    "iResidentialFacilities",
    "iCreated",
    "iPresentStatusYear",
    "iStaffStatisticsYear",
    "iStaffStatisticsApprox",
    "iStaffFullTimeTotal",
    "iStaffFullTimeMale",
    "iStaffFullTimeFemale",
    "iStaffPartTimeTotal",
    "iStaffPartTimeFemale",
    "iStaffPartTimeMale",
    "iStaffDocFullTimeTotal",
    "iStaffDocFullTimeMale",
    "iStaffDocFullTimeFemale",
    "iStudentStatisticsYear",
    "iStudentStatisticsApprox",
    "iStudentTotal",
    "iStudentMale",
    "iStudentFemale",
    "iStudentForeignTotal",
    "iStudentForeignMale",
    "iStudentForeignFemale",
    "iStudentPartTime",
    "iStudentDistance",
    "iStudentsDisabilities",
    "iAccreditingAgency",
    "iAccreditationEndDate",
    "sInstTypeID",
    "ReligionCode",
    "iStudentBody",
    "iSSAcademicCounselling",
    "iSSSocialCounselling",
    "iSSCareersAdvices",
    "iSSNurseryCare",
    "iSSCulturalActivities",
    "iSSSportsFacilities",
    "iSSLanguageLaboratory",
    "iSSDisabledFacilities",
    "iSSHealthServices",
    "iSSCanteen",
    "iSSLibrary",
    "iSSeLibrary",
    "iSSResidentialFacilities",
    "iSSITCentre",
    "iSSForeignStudiesCentre",
    "iSSOnlineDistanceLearning",
    "iDegreeNote",
    "iInputDate",
    "iMajorUpdateDate",
    "iMinorUpdateDate",
    "iMajorUpdateDateDP",
    "Street",
    "City",
    "Province",
    "PostCode",
    "Tel",
    "Fax",
    "EMail",
    "WWW",
    "UserID",
    "iWarning",
    "iDelete",
    "DPTypeContact",
    "DPName",
    "DPEMail",
    "DPEMailCopie",
    "DPStatus",
    "DPFlag",
    "DPControle",
    "DPDateEnvoi",
    "DPDateLimite",
    "DPDateAcces",
    "DPDateModif",
    "DPDateRelance",
    "DPDateRetour",
    "DPDateValid",
    "DPNbrRelance",
    "DPHistRelance",
    "iUpdate",
    "iLearning",
    "iLogo",
    "iWebUpdateDate",
    "iComment",
    "iPartnership",
    "DateAccredited",
    "iOther",
    "iInstClassHistory"
]);

const updateInstitute = async (id, updateData, user) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Whitelist and sanitize fields
        const keys = Object.keys(updateData).filter(key =>
            ALLOWED_ORG_FIELDS.has(key)
        );

        if (keys.length === 0) {
            await connection.rollback();
            return { affectedRows: 0 };
        }

        const values = keys.map(key => updateData[key]);

        // Update Query
        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const query = `UPDATE whed_org SET ${setClause} WHERE OrgID = ?`;

        const [result] = await connection.query(query, [...values, id]);

        // Add History
        await addHistoryLogforOrg({
            db: connection, // connection pass করো, pool না
            tableName: "whed_org",
            id,
            idColumn: "OrgID",
            historyColumn: "iRecordHistory",
            action: "MINOR update",
            user: user?.name,
        });

        await connection.commit();

        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
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

const getDetailedInstitutesByState = async (stateId, filters = {}) => {
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

    query += ` ORDER BY OrgID DESC`;

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




const getDetailedInstitutesByCountryCodeService = async (cntryCode, filters = {}) => {
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
    WHERE CountryCode = ?
  `;
    const params = [cntryCode];

    if (cntryCode) {
        query += ` AND CountryCode = ?`;
        params.push(cntryCode);
    }
    if (fundingType) {
        query += ` AND InstFundingTypeCode = ?`;
        params.push(fundingType);
    }
    if (search) {
        query += ` AND (OrgName LIKE ? OR InstNameEnglish LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY OrgID DESC`;

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





const getInstituteByStateAndOrgID = async (stateId, orgId) => {
    const query = `
    SELECT 
        OrgID,
        GlobalID,
        iParentOrgID,
        AliasID,
        Family,
        OrgName,
        iBranchName,
        InstNameEnglish,
        iBranchNameEnglish,
        CountryCode,
        StateCode,
        StateID,
        BranchID,
        OrgTypeCode,
        InstNameAlt,
        InstAcronym,
        InstClassCode,
        sInstTypeID,
        InstFundingTypeCode,
        iIAUMembershipOption,
        iIAULogo,
        iLogo,
        iIAUNews,
        iAAUMembershipOption,
        iOtherSites,
        iHistory,
        iAdmissionRequirements,
        iFeesN,
        iFeesNCurrencyCode,
        iFeesI,
        iFeesICurrencyCode,
        iAcademicYear,
        iLanguagesUsed,
        iLibrary,
        iMainPress,
        iResidentialFacilities,
        iCreated,
        iPresentStatusYear,
        iStudentTotal,
        iStudentForeignTotal,
        iAccreditingAgency,
        iAccreditationEndDate,
        ReligionCode,
        iStudentBody,
        DPName,
        DPEMail,
        Street,
        City,
        Province,
        PostCode,
        Tel,
        Fax,
        EMail,
        WWW,
        iStaffStatisticsYear,
        iStaffFullTimeTotal,
        iStaffFullTimeMale,
        iStaffFullTimeFemale,
        iStaffPartTimeTotal,
        iStaffPartTimeFemale,
        iStaffPartTimeMale,
        iStaffDocFullTimeTotal,
        iStaffDocFullTimeMale,
        iStaffDocFullTimeFemale,
        iStudentStatisticsYear,
        iStudentMale,
        iStudentFemale,
        iStudentForeignMale,
        iStudentForeignFemale,
        iStudentDistance,
        iStudentsDisabilities,
        iRecordHistory,
        iDegreeNote
    FROM whed_org
    WHERE StateID = ? AND OrgID = ?
  `;
    const [rows] = await pool.query(query, [stateId, orgId]);
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
    `, [orgId]);

    // Fetch fields of study for divisions
    if (divisions.length > 0) {
        const divisionIds = divisions.map(d => d.id);
        const [fosRows] = await pool.query(`
          SELECT 
            link.iDivisionID as divisionId,
            f.FOSCode as code, 
            f.FOSDisplay as display
          FROM whed_tlidivisionfoslink link
          JOIN whed_lex_fos f ON link.FOSCode = f.FOSCode
          WHERE link.iDivisionID IN (?)
        `, [divisionIds]);

        // Map FOS to divisions
        const fosMap = {};
        fosRows.forEach(fos => {
            if (!fosMap[fos.divisionId]) {
                fosMap[fos.divisionId] = [];
            }
            fosMap[fos.divisionId].push({ code: fos.code, display: fos.display });
        });

        divisions.forEach(d => {
            d.fieldsOfStudy = fosMap[d.id] || [];
        });
    }

    // Fetch related degrees
    const [degrees] = await pool.query(`
      SELECT 
        d.iDegreeID as id, 
        d.iDegree as name, 
        d.CredID as credId, 
        c.Cred as credentialName, 
        d.iDegreeOrigine as originalTitle, 
        d.iDegreeNote as note,
        c.CredID as c_CredID,
        c.StateID as c_StateID,
        c.Cred as c_Cred,
        c.cAcronym as c_cAcronym,
        c.CredCatCode1 as c_CredCatCode1,
        c.CredCatCode2 as c_CredCatCode2,
        c.CredLevelCode as c_CredLevelCode,
        c.cDescription as c_cDescription,
        c.cAlternativeQualification as c_cAlternativeQualification,
        c.cEntryExamNational as c_cEntryExamNational,
        c.cEntryExamInst as c_cEntryExamInst,
        c.cMajorUpdateDate as c_cMajorUpdateDate,
        c.cMinorUpdateDate as c_cMinorUpdateDate,
        c.cMajorUpdateDateDP as c_cMajorUpdateDateDP,
        c.cRecordHistory as c_cRecordHistory,
        c.UserID as c_UserID,
        c.cWarning as c_cWarning,
        c.cDelete as c_cDelete
      FROM whed_degree d
      LEFT JOIN whed_cred c ON d.CredID = c.CredID
      WHERE d.OrgID = ?
    `, [orgId]);

    // Map credential data and clean up temporary prefixed columns
    degrees.forEach(d => {
        if (d.c_CredID !== null && d.c_CredID !== undefined) {
            d.credientionalData = {
                id: d.c_CredID,
                CredID: d.c_CredID,
                stateId: d.c_StateID,
                StateID: d.c_StateID,
                name: d.c_Cred,
                Cred: d.c_Cred,
                acronym: d.c_cAcronym,
                cAcronym: d.c_cAcronym,
                CredCatCode1: d.c_CredCatCode1,
                CredCatCode2: d.c_CredCatCode2,
                levelCode: d.c_CredLevelCode,
                CredLevelCode: d.c_CredLevelCode,
                description: d.c_cDescription,
                cDescription: d.c_cDescription,
                cAlternativeQualification: d.c_cAlternativeQualification,
                entryExamNational: d.c_cEntryExamNational,
                cEntryExamNational: d.c_cEntryExamNational,
                entryExamInst: d.c_cEntryExamInst,
                cEntryExamInst: d.c_cEntryExamInst,
                cMajorUpdateDate: d.c_cMajorUpdateDate,
                cMinorUpdateDate: d.c_cMinorUpdateDate,
                cMajorUpdateDateDP: d.c_cMajorUpdateDateDP,
                cRecordHistory: d.c_cRecordHistory,
                userId: d.c_UserID,
                UserID: d.c_UserID,
                cWarning: d.c_cWarning,
                cDelete: d.c_cDelete
            };
        } else {
            d.credientionalData = null;
        }

        // Clean up temporary fields
        delete d.c_CredID;
        delete d.c_StateID;
        delete d.c_Cred;
        delete d.c_cAcronym;
        delete d.c_CredCatCode1;
        delete d.c_CredCatCode2;
        delete d.c_CredLevelCode;
        delete d.c_cDescription;
        delete d.c_cAlternativeQualification;
        delete d.c_cEntryExamNational;
        delete d.c_cEntryExamInst;
        delete d.c_cMajorUpdateDate;
        delete d.c_cMinorUpdateDate;
        delete d.c_cMajorUpdateDateDP;
        delete d.c_cRecordHistory;
        delete d.c_UserID;
        delete d.c_cWarning;
        delete d.c_cDelete;
    });

    // Fetch fields of study for degrees
    if (degrees.length > 0) {
        const degreeIds = degrees.map(d => d.id);
        const [fosRows] = await pool.query(`
          SELECT 
            link.iDegreeID as degreeId,
            f.FOSCode as code, 
            f.FOSDisplay as display
          FROM whed_tlidegreefoslink link
          JOIN whed_lex_fos f ON link.FOSCode = f.FOSCode
          WHERE link.iDegreeID IN (?)
        `, [degreeIds]);

        // Map FOS to degrees
        const fosMap = {};
        fosRows.forEach(fos => {
            if (!fosMap[fos.degreeId]) {
                fosMap[fos.degreeId] = [];
            }
            fosMap[fos.degreeId].push({ code: fos.code, display: fos.display });
        });

        degrees.forEach(d => {
            d.fieldsOfStudy = fosMap[d.id] || [];
        });
    }

    // Fetch contacts
    const [contacts] = await pool.query(`
      SELECT 
        ContactID as id,
        OrgID as orgId,
        JobTitle as jobTitle,
        YearsOfOffice as yearsOfOffice,
        FirstName as firstName,
        Surname as surname,
        Sex as sex,
        JobFunctionCode as jobFunctionCode,
        ContactEMail as contactEmail,
        ContactTel as contactTel
      FROM whed_contact
      WHERE OrgID = ?
    `, [orgId]);



    // --- Notun add kora holo: Periodicals fetch korar jonno ---
    const [periodicals] = await pool.query(`
      SELECT 
        iPeriodicalID as id,
        iPeriodical as name
      FROM whed_periodical
      WHERE OrgID = ?
    `, [orgId]);



    return {
        ...institute,
        divisions,
        degrees,
        contacts,
        periodicals
    };
};







const createResearchJournalsForInstituteService = async (iPeriodicalData, stateId, orgId) => {



    const mappedData = {};

    // ==========================================
    mappedData.iPeriodical = iPeriodicalData.iPeriodical ? iPeriodicalData.iPeriodical.trim() : '';
    mappedData.OrgID = orgId;



    // ==========================================
    // ১১. ডাটাবেজ ট্রানজেকশন এক্সিকিউশন
    // ==========================================
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const keys = Object.keys(mappedData);
        const values = Object.values(mappedData);

        if (keys.length === 0) {
            throw new Error("No valid fields provided for database insertion.");
        }

        const placeholders = keys.map(() => "?").join(", ");
        const columns = keys.join(", ");
        const query = `INSERT INTO whed_periodical (${columns}) VALUES (${placeholders})`;

        const [result] = await connection.query(query, values);


        const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;

        await connection.commit();


        return { id: insertId || null };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Database Service Transaction Error:", error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }


};






const deleteResearchJournalsForInstituteService = async (orgId, journalId) => {
    const query = `DELETE FROM whed_periodical WHERE OrgID = ? and iPeriodicalID = ?`;
    const [result] = await pool.query(query, [orgId, journalId]);
    return result;
};







export { createInstitute, createResearchJournalsForInstituteService, deleteInstitute, deleteResearchJournalsForInstituteService, getAllInstitutes, getDetailedInstitutesByCountryCodeService, getDetailedInstitutesByState, getInstituteByStateAndOrgID, getSingleInstitute, getTotalInstitutes, updateInstitute };


