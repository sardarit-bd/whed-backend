import { getCountriesWithResionaAndStatesServices, getInstituteByStateAndOrgIDServices, getInstitutesByStateIDServices } from '../../services/public.service.js';



/********** get all institutes **********/
const getCountriesWithResionaAndStates = async (req, res) => {
    try {


        const rows = await getCountriesWithResionaAndStatesServices();

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Country found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Countries fetched successfully",
            data: rows
        });
    } catch (error) {
        console.error('Get Countries Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch countries.'
        });
    }
};

/********** get single institute **********/
const getInstitutesByStateID = async (req, res) => {
    try {


        const { stateId } = req.params;

        const rows = await getInstitutesByStateIDServices(stateId);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No institutions found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Institutes fetched successfully",
            data: rows
        });
    } catch (error) {
        console.error('Get Institutions Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch institutions.'
        });
    }
};

/********** create institute **********/
const getInstituteByStateAndOrgID = async (req, res) => {
    try {

        const filters = {
            stateId: req.query.stateId ? parseInt(req.query.stateId) : null,
            countryCode: req.query.countryCode || null,
            fundingType: req.query.fundingType || null,
            search: req.query.search || null
        };

        const rows = await getInstituteByStateAndOrgIDServices(filters);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No institutions found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Institutes fetched successfully",
            data: rows
        });
    } catch (error) {
        console.error('Get Institutions Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch institutions.'
        });
    }
};




export { getCountriesWithResionaAndStates, getInstituteByStateAndOrgID, getInstitutesByStateID };

