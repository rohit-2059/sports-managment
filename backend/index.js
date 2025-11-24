const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const sportsRoutes = require("./routes/sportsRoutes");

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(logger);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sports API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/sports", sportsRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port http://localhost:${config.port}`);
});
