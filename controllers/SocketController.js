const path = require("path");
/*Export method that accepts an http server instance as param and performs the necessary
socket io initialization and message handling definitions*/
exports.handleSocketIO = function (server) {
  var io;
  if (process.env.NODE_ENV === "production") {
    io = require("socket.io")(server);
  } else {
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
  }
  /*const io = require("socket.io")({
    transports: ["websocket", "flashsocket", "polling", "xhr-polling"],
    allowEIO3: true, // false by default
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
    "polling duration": 10
  });
  io.listen(server);*/

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      let roomId = socket?.handshake?.headers?.referer
        ? path.basename(socket.handshake.headers.referer)
        : "errRoom";
      //console.log("disconnect from room: ", socket.handshake.headers.referer);
    });
    /*socket.on("message", (chatMsg) => {
      console.log("new chat msg", chatMsg);
    });*/

    socket.on("join-room", (roomId, userId) => {
      console.log(`user ${userId} joined the room`, roomId);
      socket.join(roomId);
      //socket.broadcast.emit("user-connected", userId);

      socket.on("message", (chatMsg) => {
        console.log("new chat msg", chatMsg);
        io.to(roomId).emit("createMessage", chatMsg);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnect", userId);
        socket.to(roomId).emit("user-disconnected", userId);
      });

      socket.to(roomId).emit("user-connected", userId);
    });
  });
};
