const csvContacts = require("./validContacts.js");
const upload = require("./multerFile.js");
const del_uploads = require("./del_uploads.js");

const express = require("express");
const ejs = require("ejs");
const qrcode = require("qrcode");
const { Client, MessageMedia } = require("whatsapp-web.js");

const directory = "./uploads";

del_uploads(directory);

const sendStatus = {};

const clientQRpro = (clt) => {
  return new Promise((resolve, reject) => {
    clt.on("qr", (qr) => {
      qrcode.toDataURL(qr, (err, url) => {
        if (err) reject("Erorr happend");
        const obj = { clt: clt, url: url };
        resolve(obj);
      });
    });
  });
};

const clientReadyPro = (clt, chatId, message) => {
  return new Promise((resolve, reject) => {
    clt.on("ready", async (err) => {
      console.log("Client is ready!");

      await clt.sendMessage(chatId, message).then(() => {
        console.log(`🟢 Successfuly sent to ${chatId}`);
        sendStatus[chatId.slice(1, 12)] = "🟢Successfuly sent";
      });

      if (err) {
        reject(`🔴 Failed sent to ${chatId}`);
        sendStatus[chatId.slice(1, 12)] = "🔴 Failed to send";
      }

      // resolve(clt);
    });
  });
};

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.get("/upload", (req, res) => {
  res.render("upload");
});

const cpUpload = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "images" },
]);

app.post("/upload", cpUpload, async (req, res) => {
  let client = new Client();
  client.initialize();

  const message = req.body.text;
  console.log(message);
  const filename = req.files["file"][0].originalname;
  // console.log(filename);
  // console.log(`./uploads/${filename}`);
  const { users, headers } = await csvContacts(`./uploads/${filename}`);
  console.log(users);
  console.log(headers);

  let images;

  try {
    images = req.files["images"][0].originalname;
    console.log(images);
    images = `./uploads/${images}`;
    console.log(images);
    images = MessageMedia.fromFilePath(images);
  } catch {
    let images = 0;
  }

  let { clt, url } = await clientQRpro(client);

  res.render("waiting", {
    qr_code: url,
  });

  // ls = ["201283102140@c.us", "201000000000@c.us"];
  for (const user of users) {
    // console.log(user);
    clientReadyPro(
      clt,
      user.ph_phone_ph,
      message.replace("ph_name_ph", user.ph_name_ph)
    );
    if (images != 0) {
      clientReadyPro(clt, user.ph_phone_ph, images);
      // clientReadyPro(clt, user.phone, img);
    }
  }
});

var sendStatusLength = Object.keys(sendStatus).length;

app.get("/status", (req, res) => {
  res.render("status", {
    sendStatus: sendStatus,
  });
});

console.log(sendStatusLength);

app.listen(port, console.log(`Listening on port ${port}`));
