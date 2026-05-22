const Chat = require("../models/chats");
const Signup = require("../models/signup");

module.exports = (socket, io) => {

  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join-room", (roomName) => {

    socket.join(roomName);

    console.log(`Socket ${socket.id} joined room ${roomName}`);
  });

  // SEND MESSAGE
  socket.on("personal_message", async (data) => {

    try {

      const user = await Signup.findByPk(socket.user.userId);

      if (!user) {

        return socket.emit("error_message", {
          message: "User not found"
        });
      }

      const savedMessage = await Chat.create({
        message: data.message || "",
        mediaUrl: data.mediaUrl || null,
        mediaType: data.mediaType || null,
        roomName: data.roomName,
        userId: user.userId
      });

      const payload = {
        id: savedMessage.id,
        roomName: data.roomName,
        message: savedMessage.message,
        mediaUrl: savedMessage.mediaUrl,
        mediaType: savedMessage.mediaType,
        userId: user.userId,
        name: user.name,
        createdAt: savedMessage.createdAt
      };

      // SEND ONLY TO ROOM
      io.to(data.roomName).emit("receive_message", payload);

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