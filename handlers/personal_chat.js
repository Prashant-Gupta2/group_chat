const Chat = require("../models/chats");
const Signup = require("../models/signup");

module.exports = (socket, io) => {

  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join-room", (roomName) => {

    socket.join(roomName);

    console.log(`${socket.user.name} joined ${roomName}`);

  });

  // PERSONAL MESSAGE
  socket.on("personal_message", async ({ message, roomName }) => {

    try {

      // VALIDATION
      if (!message || message.trim() === "") {
        return socket.emit("error_message", {
          message: "Message cannot be empty"
        });
      }

      // FIND USER
      const user = await Signup.findByPk(socket.user.userId);

      if (!user) {
        return socket.emit("error_message", {
          message: "User not found"
        });
      }

      // SAVE MESSAGE
      const savedMessage = await Chat.create({
        message,
        userId: user.userId
      });

      // SEND TO ROOM
      io.to(roomName).emit("receive_message", {
        id: savedMessage.id,
        message: savedMessage.message,
        userId: user.userId,
        name: user.name,
        roomName,
        createdAt: savedMessage.createdAt
      });

    } catch (err) {

      console.log(err);

      socket.emit("error_message", {
        message: "Failed to send message"
      });

    }

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

};