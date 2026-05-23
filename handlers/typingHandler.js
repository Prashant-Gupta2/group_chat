module.exports = (socket, io) => {

  socket.on("typing", (data) => {
    socket.to(data.roomName).emit("typing", {
      username: data.username
    });
  });

  socket.on("stop-typing", (data) => {
    socket.to(data.roomName).emit("stop-typing", {
      username: data.username
    });
  });

};