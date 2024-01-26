const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
      req.user = await User.findById({ _id: id }).select("-password");
    } catch (err) {
      console.log(err);
      res.status(401);
      throw Error("Not authorized, token failed");
    }
  } else {
    console.log("Authorization token not provided");
    res.status(401);
    throw Error("Not authorized, no token");
  }
  next();
});

module.exports = authMiddleware;
