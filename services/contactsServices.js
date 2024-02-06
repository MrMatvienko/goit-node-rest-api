// const fs = require("fs").promises;
// const path = require("path");
// const nanoid = require("nanoid");

import { Contact } from "../models/contactModel.js";

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    console.error("Error getting contacts:", error.message);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    console.error("Error getting contact by id:", error.message);
    throw error;
  }
};

const addContact = async ({ name, email, phone, favorite }) => {
  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      favorite,
    });
    return await newContact.save();
  } catch (error) {
    console.error("Error creating contact:", error.message);
    throw error;
  }
};

const updateContactDetails = async (id, { name, email, phone, favorite }) => {
  try {
    return await Contact.findByIdAndUpdate(
      id,
      { name, email, phone, favorite },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating contact:", error.message);
    throw error;
  }
};

const removeContact = async (id) => {
  try {
    return await Contact.findOneAndDelete({ _id: id });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    throw error;
  }
};

export {
  listContacts,
  getContactById,
  addContact,
  updateContactDetails,
  removeContact,
};
