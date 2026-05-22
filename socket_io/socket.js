const { Server } = require('socket.io');
const socketAuth = require('./middleware');
const chatHandler = require('../handlers/chat')
const personalChatHandler = require('../handlers/personal_chat');

module.exports = (server)=>{
 const io = new Server(server, {
 
   cors: {
     origin: "*",
     methods: ["GET", "POST"]
   }
 
 });
 socketAuth(io);

 io.on('connection', (socket) => {
  chatHandler(socket,io);
  // personalChatHandler(socket,io);
});

 return io;
}