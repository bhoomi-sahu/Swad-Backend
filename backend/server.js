const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const cartRoutes = require("./routes/cartRoutes");
const Message = require("./models/Message");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

connectDB();

const app = express();
const server = http.createServer(app);

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Express CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman/mobile apps (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/location", require("./routes/locationRoutes"));
app.use("/api/cart", cartRoutes);
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Socket.io
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      await Message.create({
        roomId: data.roomId,
        sender: data.sender,
        text: data.text,
        orderId: data.orderId || "",
      });

      const savedMessage = {
        ...data,
        createdAt: new Date(),
      };

      io.to(data.roomId).emit("receiveMessage", savedMessage);

      if (
        data.legacyRoomId &&
        data.legacyRoomId !== data.roomId
      ) {
        io.to(data.legacyRoomId).emit(
          "receiveMessage",
          savedMessage
        );
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// Home Route
app.get("/", (req, res) => {
  res.send("API Running - Swad Backend");
});

// Health Check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("Allowed Origins:", allowedOrigins);
});