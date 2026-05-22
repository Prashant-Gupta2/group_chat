const Chat = require("../models/chats");
const Signup = require("../models/signup");

module.exports = (socket, io) => {

  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join-room", (roomName) => {

    if (!roomName) return;

    socket.join(roomName);

    console.log(`User ${socket.user.userId} joined ${roomName}`);
  });

  // SEND MESSAGE
  socket.on("personal_message", async ({ message, roomName }) => {

    try {

      // VALIDATION
      if (!message || message.trim() === "") {

        return socket.emit("error_message", {
          message: "Message cannot be empty"
        });
      }

      // CHECK ROOM MEMBERSHIP
      const rooms = [...socket.rooms];

      if (!rooms.includes(roomName)) {

        return socket.emit("error_message", {
          message: "You are not in this room"
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
        roomName,
        userId: user.userId
      });

      // PAYLOAD
      const payload = {
        id: savedMessage.id,
        message: savedMessage.message,
        roomName,
        userId: user.userId,
        name: user.name,
        createdAt: savedMessage.createdAt
      };

      // SEND TO ROOM
      io.to(roomName).emit("receive_message", payload);

    } catch (err) {

      console.log(err);

      socket.emit("error_message", {
        message: "Failed to send message"
      });
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {

    console.log("User disconnected:", socket.id);
  });

};