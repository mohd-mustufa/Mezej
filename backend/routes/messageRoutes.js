const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/messageControllers");
const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:chatId", authMiddleware, getAllMessages);

module.exports = router;
