const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for all origins
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Simple test route
app.get("/api/health", (req, res) => {
  console.log("Health check received");
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Test login route
app.post("/api/auth/login", (req, res) => {
  console.log("Login request received:", req.body);

  if (
    req.body.email === "admin@sportsmanagement.com" &&
    req.body.password === "admin123"
  ) {
    res.json({
      success: true,
      token: "test-token-123",
      data: {
        user: {
          id: "123",
          name: "Super Administrator",
          email: "admin@sportsmanagement.com",
          role: "super_admin",
          isActive: true,
          registrationDate: new Date().toISOString(),
        },
      },
    });
  } else {
    res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  }
});

const PORT = 8000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Test URL: http://127.0.0.1:${PORT}`);
});
