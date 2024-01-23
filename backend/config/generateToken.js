const jwt = require("jsonwebtoken");

// Returns a jwt token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
