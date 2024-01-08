const qrcode = require("qrcode-terminal");
const { Client, MessageMedia } = require("whatsapp-web.js");
const express = require("express");
const app = express();

// Use the saved values
const client = new Client();
client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log(qr);
});


// route handler
app.get("/", (req, res) => {
  client.on("ready", () => {
  // After successful authentication
  console.log("Client is ready!");
  // client.getChats().then((chats) => {
  //   console.log(chats[2]);
  // });

  chatId = ["200000000001@c.us", "200000000002@c.us"];
  message = "Hello from here 5";
  // message = MessageMedia.fromFilePath("./uploads/img1.jpg");

  chatId.forEach((element) =>
    client
      .sendMessage(element, message)
      .then(() => {
        console.log(`🟢 Successfuly sent to ${element}`);
      })
      .catch((err) => {
        console.log(`🔴 Failed sent to ${element}`);
      })
    );
  });
});

app.listen(3000);
