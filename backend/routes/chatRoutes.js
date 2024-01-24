const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  fetchSingleChat,
  fetchAllChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

router.post("/:userId", authMiddleware, fetchSingleChat);
router.get("/", authMiddleware, fetchAllChats);
router.post("/group/create", authMiddleware, createGroupChat);
router.put("/group/rename", authMiddleware, renameGroup);
router.put("/group/addUser", authMiddleware, addUserToGroup);
router.put("/group/removeUser", authMiddleware, removeUserFromGroup);

module.exports = router;
