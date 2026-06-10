import {
  createContact as createContactService,
  deleteContact as deleteContactService,
  getAllContacts as getAllContactsService,
  getSingleContact as getSingleContactService,
  getTotalContacts as getTotalContactsService,
  updateContact as updateContactService
} from "../../services/contact.service.js";

/********** get all contacts **********/
const getAllContact = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const orgId = req.query.orgId ? parseInt(req.query.orgId) : null;

    const [rows, total] = await Promise.all([
      getAllContactsService(limit, offset, orgId),
      getTotalContactsService(orgId)
    ]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contacts found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit
      },
      data: rows
    });
  } catch (error) {
    console.error('Get Contacts Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts.'
    });
  }
};

/********** get single contact **********/
const getSingleContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }
    const contact = await getSingleContactService(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found." });
    }
    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the contact!",
    });
  }
};

/********** create contact **********/
const createContact = async (req, res) => {
  try {
    const result = await createContactService(req.validatedBody);
    res.status(201).json({
      success: true,
      message: "Contact created successfully!",
      data: result
    });
  } catch (error) {
    console.error("Create Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create contact."
    });
  }
};

/********** update contact **********/
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }

    const updateData = { ...req.validatedBody };

    const result = await updateContactService(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact updated successfully!",
    });
  } catch (err) {
    console.error("Error updating contact:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the contact.",
    });
  }
};

/********** delete contact **********/
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    const result = await deleteContactService(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting contact:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the contact.",
    });
  }
};

export {
  createContact,
  deleteContact,
  getAllContact,
  getSingleContact,
  updateContact
};
