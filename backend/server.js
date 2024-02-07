const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Mezej");
});

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log("App is listening on port", PORT)
);

const io = require("socket.io")(server, {
  pingTimeout: 1000000,
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("connected to sockett");

  socket.on("setup", (user) => {
    socket.join(user.id);
    socket.emit("connected");
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("User Joined Room: " + roomId);
  });

  socket.on("new message", (newMessageData) => {
    const chat = newMessageData.chat;
    if (!chat.users) {
      console.log("Chat users not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageData.sender._id) return;

      socket.in(user._id).emit("message received", newMessageData);
    });
  });

  socket.on("typing", (roomId) => {
    socket.in(roomId).emit("typing");
  });

  socket.on("stop typing", (roomId) => {
    socket.in(roomId).emit("stop typing");
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(user.id);
  });
});
