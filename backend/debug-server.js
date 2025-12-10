const http = require("http");

console.log("🔍 Starting debug server...");
console.log("Node version:", process.version);
console.log("Platform:", process.platform);

const server = http.createServer((req, res) => {
  console.log(`📥 Request received: ${req.method} ${req.url}`);
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(
    JSON.stringify({
      message: "Server is working!",
      timestamp: new Date().toISOString(),
    })
  );
});

const PORT = 4444;

server.on("error", (err) => {
  console.error("❌ Server error:", err.message);
  console.error("Error code:", err.code);
  console.error("Full error:", err);
});

server.on("listening", () => {
  const address = server.address();
  console.log("✅ Server is LISTENING");
  console.log("Address info:", address);
  console.log(`🌐 URL: http://localhost:${address.port}`);
});

server.on("connection", (socket) => {
  console.log("🔌 New connection established");
});

console.log(`🚀 Attempting to listen on port ${PORT}...`);
server.listen(PORT, "0.0.0.0");

// Keep the process alive
setInterval(() => {
  console.log("💓 Server heartbeat - still running");
}, 5000);
