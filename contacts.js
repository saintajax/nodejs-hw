const fs = require("fs/promises");
const path = require("path");
const colors = require("colors");

const contactsPath = path.resolve("db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.error(`ERROR: ${err.message}`.red));
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => {
      const normData = JSON.parse(data);
      const requestedContact = normData.find(
        (contact) => Number(contact.id) === Number(contactId)
      );
      console.log(requestedContact);
    })
    .catch((err) => console.error(`ERROR: ${err.message}`.red));
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => {
      let isSuchContact = false;
      const normData = JSON.parse(data);
      const filteredContacts = normData.filter((contact) => {
        if (Number(contact.id) === Number(contactId)) {
          isSuchContact = true;
        }
        return Number(contact.id) !== Number(contactId);
      });
      if (!isSuchContact) {
        console.log(`There are no contact with id ${contactId}`.red);
        return;
      }
      fs.writeFile(`${contactsPath}`, JSON.stringify(filteredContacts))
        .then((_) => console.log("Contact successfully deleted".green))
        .catch((err) => console.error(`ERROR: ${err.message}`.red))
        .finally(() => {
          isSuchContact = false;
        });
    })
    .catch((err) => console.error(`ERROR: ${err.message}`.red));
}

function addContact(name, email, phone) {
  const newContact = { id: null, name, email, phone };
  fs.readFile(contactsPath, "utf-8")
    .then((data) => {
      const normData = JSON.parse(data);
      normData.forEach((el) => {
        newContact.id = String(Number(el.id) + 1);
      });
      normData.push(newContact);
      fs.writeFile(`${contactsPath}`, JSON.stringify(normData))
        .then((_) => console.log("Contact successfully added".green))
        .catch((err) => console.error(`ERROR: ${err.message}`.red));
    })
    .catch((err) => console.error(`ERROR: ${err.message}`.red));
}

module.exports = { addContact, removeContact, getContactById, listContacts };
