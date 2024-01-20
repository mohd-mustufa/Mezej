const express = require("express");
const dotenv = require("dotenv");
const chats = require("./dummy_data");

dotenv.config();
const app = express();

app.get("/chats", (req, res) => {
  res.json(chats);
});

app.get("/", (req, res) => {
  res.send("Welcome to Mezej");
});

app.get("/chats/:id", (req, res) => {
  const id = req.params.id;
  const data = chats.find((chat) => chat._id == id);
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("App is listening on port", PORT));
