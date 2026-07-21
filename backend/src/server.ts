import { env } from "node:process";
import http from "node:http";
import app from "./app.js";
import { connectDB } from "./config/database.js";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware/socket.middleware.js";
import { registerSocketHandlers } from "./modules/socket/socket.handlers.js";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  registerSocketHandlers(io, socket);
});

async function startServer() {
  try {
    await connectDB();
    console.log("✅ Database connected");

    httpServer.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
}

startServer();

export default app;
