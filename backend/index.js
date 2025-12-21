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
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL, // Add your Vercel URL here
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
app.use("/api/contact", contactRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

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
