import {
  listContacts,
  getContactById,
  addContact,
  updateContactDetails,
  removeContact,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import { Contact } from "../models/contactModel.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error getting contacts:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await getContactById(id);

    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error getting contact by id:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await removeContact(id);

    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    await createContactSchema.validateAsync({ name, email, phone });

    const newContact = await addContact({ name, email, phone });

    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;

  try {
    if (!name && !email && !phone && favorite === undefined) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    await updateContactSchema.validateAsync({ name, email, phone });

    const updatedContact = await updateContactDetails(id, {
      name,
      email,
      phone,
      favorite,
    });

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error updating contact:", error.message);
    res.status(400).json({ message: error.message });
  }
};
export const updateContactStatus = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error("Error updating contact status:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
