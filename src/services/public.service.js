import pool from '../config/db.js';



const getCountriesWithResionaAndStatesServices = async () => {
  const query = `
        SELECT
            c.CountryCode,
            c.Country,
            c.RegionMap,
            c.DisplayFont,
            c.PostCodePos,
            c.CurrencyCode,
            c.CountryFr,
            c.ISO3,
            c.PrintFundingHeads,
            c.Public,
            c.RegionCRM,
            c.RegionCodeCRM,
            c.RegionSiteIAU,

            (
                SELECT JSON_OBJECT(
                    'StateID', s.StateID,
                    'State', s.State,
                    'StateCode', s.StateCode,
                    'ISO3', s.ISO3
                )
                FROM whed_state s
                WHERE s.CountryCode = c.CountryCode
                LIMIT 1
            ) AS state

        FROM whed_lex_country c
        ORDER BY c.Country;
    `;

  const [rows] = await pool.query(query);

  const countries = rows.map((country) => ({
    ...country,
    state: country.state ? JSON.parse(country.state) : null,
  }));

  return countries;
};




const getInstitutesByStateIDServices = async (stateId) => {
  // Get state information
  const [stateRows] = await pool.query(
    `SELECT * FROM whed_state WHERE StateID = ?`,
    [stateId]
  );

  if (stateRows.length === 0) {
    return null;
  }

  const state = stateRows[0];

  // Get all institutes under this state
  const [orgRows] = await pool.query(
    `SELECT * FROM whed_org WHERE StateID = ?`,
    [stateId]
  );

  // Attach institutes to state object
  state.org = orgRows;

  return state;
};




const getInstituteByStateAndOrgIDServices = async (stateId, orgId) => {


  console.log(stateId, orgId);

  const query = `
    SELECT *FROM whed_org WHERE StateID = ? AND OrgID = ?
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


  console.log("Check Institute Periodicals in Backend:", periodicals);
  console.log("Check Institute Logo in Backend:", institute.iLogo);

  return {
    ...institute,
    divisions,
    degrees,
    contacts,
    periodicals
  };
};
















export { getCountriesWithResionaAndStatesServices, getInstituteByStateAndOrgIDServices, getInstitutesByStateIDServices };


