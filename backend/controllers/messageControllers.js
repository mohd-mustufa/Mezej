const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if ((!chatId, !content)) {
    console.log("Pls send all the fields");
    res.status(400).send("Pls send all the fields");
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    const message = await Message.create(newMessage);
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    let fullMessage = await Message.findById(message._id)
      .populate("sender", "-password")
      .populate("chat");

    fullMessage = await User.populate(fullMessage, {
      path: "chat.users",
      select: "name email pic",
    });

    res.send(fullMessage);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const allMessages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "-password")
      .populate("chat");
    res.send(allMessages);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

module.exports = { sendMessage, getAllMessages };
