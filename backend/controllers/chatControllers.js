const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Fetches one on one chat, creates new chat if it doesn't exist
const fetchSingleChat = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    console.log("User does not exist");
    res.status(404).send("User does not exist");
    throw Error("User does not exist");
  }

  const chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage")
    .populate("latestMessage.sender", "name email");

  if (chat.length > 0) {
    res.status(200).send(chat[0]);
  } else {
    let newChat = new Chat({
      chatName: "Dummy",
      users: [userId, req.user._id],
    });

    try {
      const createdChat = await Chat.create(newChat);
      const fullChat = await Chat.findById(createdChat._id).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
      throw Error(err.message);
    }
  }
});

// Fetches all the chats including grp chats for the user
const fetchAllChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).send(chats);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
    throw Error(err.message);
  }
});

// Create a group chat with the logged in user as admin
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    console.log("Please fill all the fileds");
    res.status(400).send("Please fill all the fileds");
  }

  if (req.body.users.length < 1) {
    console.log("Cannot create group with less than 2 users");
    res.status(400).send("Cannot create group with less than 2 users");
  }

  try {
    const users = req.body.users;
    users.push(req.user._id.toString());
    // Removing duplicates if any
    const uniqueUsers = Array.from(new Set(users));

    const createdGroup = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: uniqueUsers,
      groupAdmins: [req.user._id],
    });
    const fullGroupChat = await Chat.findById(createdGroup._id)
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    res.status(200).send(fullGroupChat);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
    throw Error(err.message);
  }
});

// Renames a group
const renameGroup = asyncHandler(async (req, res) => {
  // ChatId and GroupId are the same
  const { groupId, newGroupName } = req.body;

  if (!groupId || !newGroupName) {
    res.status(400).send("Pls provide all the required fields");
  }

  // Check if the group exists
  const group = await Chat.findById(groupId);
  if (!group || !group.isGroupChat) {
    console.log("Group does not exist");
    throw Error("Group does not exist");
  }

  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { chatName: newGroupName },
      { new: true } // Returns the modified document rather than the original one
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    res.status(200).send(updatedGroup);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
    throw Error(err.message);
  }
});

// Adds new user to the group
const addUserToGroup = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.body;
  if (!groupId || !userId) {
    console.log("Pls provide all the required fields");
    throw Error("Pls provide all the required fields");
  }

  // Check if the user is a valid user
  const user = await User.findById(userId);
  if (!user) {
    console.log("User does not exist");
    throw Error("User does not exist");
  }

  // Check if the group exists
  const group = await Chat.findById(groupId);
  if (!group || !group.isGroupChat) {
    console.log("Group does not exist");
    throw Error("Group does not exist");
  }

  // Check if the user already belongs to the group chat
  if (group.users.includes(userId)) {
    console.log("User already exists in the group");
    throw Error("User already exists in the group");
  }

  // Add user to the group chat
  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    res.status(200).send(updatedGroup);
  } catch (err) {
    console.log(err);
    throw Error(err.message);
  }
});

// Removes existing user from group
const removeUserFromGroup = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.body;
  if (!groupId || !userId) {
    console.log("Pls provide all the required fields");
    throw Error("Pls provide all the required fields");
  }

  // Check if the user is a valid user
  const user = await User.findById(userId);
  if (!user) {
    console.log("User does not exist");
    throw Error("User does not exist");
  }

  // Check if the group exists
  const group = await Chat.findById(groupId);
  if (!group || !group.isGroupChat) {
    console.log("Group does not exist");
    throw Error("Group does not exist");
  }

  // Check if the user belongs to the group chat
  if (!group.users.includes(userId)) {
    console.log("User not found in the group");
    throw Error("User not found in the group");
  }

  // Remove user from the group chat
  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { $pull: { users: userId, groupAdmins: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    res.status(200).send(updatedGroup);
  } catch (err) {
    console.log(err);
    throw Error(err.message);
  }
});

module.exports = {
  fetchSingleChat,
  fetchAllChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
};
