const fs = require("fs");
const csvParser = require("csv-parser");
const { error } = require("console");

function fetchNumbersFromFile(file) {
  const regex = /[\+]*\d{11}/g; // /[A-Z]/g;
  // const regex = /^[0]\d{10}/g; // Start with 0 and percedes with 10 digit
  return file.match(regex);
}

function realContacts(contacts) {
  let newContacts = [];
  for (const x in contacts) {
    if (contacts[x].startsWith("01")) {
      newContacts.push(contacts[x]);
    }
  }
  return newContacts;
}

function whatsAppContacts(textFile) {
  textFile = fs.readFileSync(textFile, "utf-8");
  let contacts = fetchNumbersFromFile(textFile);
  contacts = realContacts(contacts);
  return contacts.map((x) => "2" + x + "@c.us");
}

function csvContacts(textfile) {
  const result = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(textfile)
      .pipe(csvParser())
      .on("data", (data) => {
        // console.log(data.phone);
        data.ph_name_ph = data.ph_name_ph.split(" ")[0];
        data.ph_phone_ph = `2${data.ph_phone_ph}@c.us`; // ccc => Country Calling Code
        // console.log(data);
        result.push(data);
      })
      .on("headers", (headers) => {
        // console.log(headers);
        // console.log(`First header: ${headers[0]}`);
        resolve({ users: result, headers: headers });
      })
      .on("end", () => {
        console.log("Reading file END");
      });
  });
}

module.exports = csvContacts;
