const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const connectDB = require("./config/database");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const sportsRoutes = require("./routes/sportsRoutes");
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const matchRoutes = require("./routes/matchRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins during development
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Sports Management API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      teams: "/api/teams",
      sports: "/api/sports",
      tournaments: "/api/tournaments",
      health: "/api/health",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/sports", sportsRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/stats", statsRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(
    `🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`
  );
  console.log(`📊 API Documentation: http://localhost:${config.port}`);
});
