const express = require("express");
const {
  registerUser,
  authUser,
  getUsers,
} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/", authMiddleware, getUsers);

module.exports = router;
