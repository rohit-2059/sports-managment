const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify({ message: "Server is working!" }));
});

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`✅ Simple HTTP server running on http://localhost:${PORT}`);
  console.log(`Testing: curl http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ Server error:", err);
});
