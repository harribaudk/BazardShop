const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let ioInstance = null;

const initRealtime = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Token manquant."));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = payload.id;
      return next();
    } catch (error) {
      return next(new Error("Token invalide."));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    socket.join(`user:${userId}`);

    socket.on("disconnect", () => {});
  });

  ioInstance = io;
  return io;
};

const emitToUser = (userId, event, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit(event, payload);
};

module.exports = { initRealtime, emitToUser };
