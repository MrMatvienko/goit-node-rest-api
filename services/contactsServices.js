// const fs = require("fs").promises;
// const path = require("path");
// const nanoid = require("nanoid");

import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.join(__dirname, "./db/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === contactId);
  return result || null;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (id, { name, email, phone }) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) return null;

  contacts[index] = { id, name, email, phone };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

const removeContact = async (id) => {
  const contacts = await listContacts();
  const newContacts = contacts.filter((item) => item.id !== id);

  if (contacts.length === newContacts.length) {
    return null;
  }
  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  const oldContacts = contacts.filter((item) => item.id === id);

  return oldContacts;
};

export {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
