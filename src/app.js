const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const authRouter = require("./routers/auth.route");

const app = express();

// ✅ CORS Setup
const corsOptions = {
  origin: ["http://localhost:5173", "https://frontend1-imx8.vercel.app/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);

module.exports = app;
