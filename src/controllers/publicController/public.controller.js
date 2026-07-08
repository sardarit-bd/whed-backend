import { getCountriesWithResionaAndStatesServices, getEducationSystemAndCredientialListByCountryCodeServices, getEducationalSystemAndCredientialDetailesByStateIDServices, getInstituteByStateAndOrgIDServices, getInstitutesByStateIDServices } from '../../services/public.service.js';




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



const getEducationSystemAndCredientialListByCountryCode = async (req, res) => {
    try {


        const { countryCode } = req.params;

        const rows = await getEducationSystemAndCredientialListByCountryCodeServices(countryCode);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Education System and Crediential List found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Education System and Crediential List fetched successfully",
            data: rows
        });
    } catch (error) {
        console.error('Get Education System and Crediential List Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch Education System and Crediential List.'
        });
    }
}



const getEducationalSystemAndCredientialDetailesByStateID = async (req, res) => {
    try {


        const { stateId } = req.params;

        const rows = await getEducationalSystemAndCredientialDetailesByStateIDServices(stateId);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Education System and Crediential Detailes found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Education System and Crediential Detailes fetched successfully",
            data: rows
        });
    } catch (error) {
        console.error('Get Education System and Crediential Detailes Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch Education System and Crediential Detailes.'
        });
    }
}





export { getCountriesWithResionaAndStates, getEducationSystemAndCredientialListByCountryCode, getEducationalSystemAndCredientialDetailesByStateID, getInstituteByStateAndOrgID, getInstitutesByStateID };

