const Chat = require("../models/chats");
const Signup = require("../models/signup");

module.exports = (socket,io) =>{
 console.log("User connected:", socket.id);

  socket.on('send_message', async (data) => {

    try {

      const user = await Signup.findByPk(socket.user.userId);

      if (!user) {
        return socket.emit('error_message', {
          message: 'User not found'
        });
      }

      const savedMessage = await Chat.create({
        message: data.message,
        userId: user.userId
      });

      io.emit('receive_message', {
        id: savedMessage.id,
        message: savedMessage.message,
        userId: user.userId,
        name: user.name,
        createdAt: savedMessage.createdAt
      });

    } catch (err) {

      console.log(err);

      socket.emit('error_message', {
        message: 'Failed to send message'
      });

    }

  });

}