import { 
  createCountry as createCountryService, 
  deleteCountry as deleteCountryService, 
  getAllCountries as getAllCountriesService, 
  getSingleCountry as getSingleCountryService, 
  updateCountry as updateCountryService 
} from '../../services/country.service.js';

/********** get all countries **********/
const getAllCountries = async (req, res) => {
  try {
    const rows = await getAllCountriesService();

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No countries found"
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

/********** get single country **********/
const getSingleCountry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }
    const country = await getSingleCountryService(id);
    if (!country) {
      return res.status(404).json({ error: "Country not found." });
    }
    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    console.error("Error fetching country:", error.message);
    res.status(500).json({
      success: false,
      error: "Something went wrong while fetching the country!",
    });
  }
};

/********** create country **********/
const createCountry = async (req, res) => {
  try {
    const result = await createCountryService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "Country created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create Country Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create country."
    });
  }
};

/********** update country **********/
const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateCountryService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Country not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Country updated successfully!",
    });
  } catch (err) {
    console.error("Error updating country:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the country.",
    });
  }
};

/********** delete country **********/
const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteCountryService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Country not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Country deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting country:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the country.",
    });
  }
};

export { createCountry, deleteCountry, getAllCountries, getSingleCountry, updateCountry };
