const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// Converting the name entered by the user to register to titleCase
const titleCase = (str) => {
  str = str.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};

// Create a new user and store in db
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw Error("Please enter all the fields");
  }

  if (await User.findOne({ email })) {
    res.status(403);
    throw Error("User already exists");
  }

  const user = await User.create({
    name: titleCase(name),
    email: email.toLowerCase(),
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(403);
    throw Error("Could not create a user");
  }
});

// Validate login for a user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw Error("Email is incorrect");

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    throw Error("Password is incorrect");
  }
});

// Returns all the users, filters the search if query params are provided
const getUsers = asyncHandler(async (req, res) => {
  const filterObj = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await User.find(filterObj).find({
      _id: { $ne: req.user._id },
    });
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw Error(err.message);
  }
});

module.exports = { registerUser, authUser, getUsers };
