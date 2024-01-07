const fs = require("fs");
const path = require("path");

function del_uploads(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

module.exports = del_uploads;

// # Using promises

// import fs from "node:fs/promises";
// import path from "node:path";

// const directory = "test";

// for (const file of await fs.readdir(directory)) {
//   await fs.unlink(path.join(directory, file));
// }
