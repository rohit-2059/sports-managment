const axios = require("axios");

const BASE_URL = "http://127.0.0.1:3001/api";

// Test function to register users and demonstrate the API
const testAPI = async () => {
  try {
    console.log("🚀 Starting API Tests...\n");

    // Test 1: Health Check
    try {
      console.log("1️⃣  Testing Health Check...");
      const healthResponse = await axios.get(`${BASE_URL}/health`);
      console.log("✅ Health Check:", healthResponse.data);
      console.log("");
    } catch (error) {
      console.log("❌ Health Check failed:", error.message);
      console.log("");
    }

    // Test 2: Register Coach
    console.log("2️⃣  Registering Coach...");
    const coachData = {
      name: "John Smith",
      email: "coach@example.com",
      password: "password123",
      role: "coach",
    };

    try {
      const coachResponse = await axios.post(
        `${BASE_URL}/auth/register`,
        coachData
      );
      console.log("✅ Coach Registered:", {
        name: coachResponse.data.data.user.name,
        email: coachResponse.data.data.user.email,
        role: coachResponse.data.data.user.role,
        id: coachResponse.data.data.user.id,
      });
      const coachToken = coachResponse.data.token;
      console.log(
        "🔐 Coach Token (first 50 chars):",
        coachToken.substring(0, 50) + "..."
      );
      console.log("");

      // Test 3: Create Team with Coach
      console.log("3️⃣  Creating Team...");
      const teamData = {
        name: "Mumbai Warriors",
        shortName: "MUW",
        description: "Professional cricket team from Mumbai",
        homeGround: "Mumbai Stadium",
        contactEmail: "info@mumbaiwarriors.com",
        contactPhone: "+91-98765-43210",
      };

      try {
        const teamResponse = await axios.post(`${BASE_URL}/teams`, teamData, {
          headers: { Authorization: `Bearer ${coachToken}` },
        });
        console.log("✅ Team Created:", {
          name: teamResponse.data.data.team.name,
          shortName: teamResponse.data.data.team.shortName,
          coach: teamResponse.data.data.team.coachId,
          isApproved: teamResponse.data.data.team.isApproved,
        });
        console.log("");
      } catch (error) {
        console.log(
          "❌ Team Creation failed:",
          error.response?.data || error.message
        );
        console.log("");
      }
    } catch (error) {
      console.log(
        "❌ Coach Registration failed:",
        error.response?.data || error.message
      );
      console.log("");
    }

    // Test 4: Register Player
    console.log("4️⃣  Registering Player...");
    const playerData = {
      name: "Mike Johnson",
      email: "player@example.com",
      password: "password123",
      role: "player",
    };

    try {
      const playerResponse = await axios.post(
        `${BASE_URL}/auth/register`,
        playerData
      );
      console.log("✅ Player Registered:", {
        name: playerResponse.data.data.user.name,
        email: playerResponse.data.data.user.email,
        role: playerResponse.data.data.user.role,
        id: playerResponse.data.data.user.id,
      });
      const playerToken = playerResponse.data.token;
      console.log(
        "🔐 Player Token (first 50 chars):",
        playerToken.substring(0, 50) + "..."
      );
      console.log("");
    } catch (error) {
      console.log(
        "❌ Player Registration failed:",
        error.response?.data || error.message
      );
      console.log("");
    }

    // Test 5: Login as Super Admin
    console.log("5️⃣  Testing Super Admin Login...");
    const adminLoginData = {
      email: "admin@sportsmanagement.com",
      password: "admin123",
    };

    try {
      const adminLoginResponse = await axios.post(
        `${BASE_URL}/auth/login`,
        adminLoginData
      );
      console.log("✅ Super Admin Login:", {
        name: adminLoginResponse.data.data.user.name,
        email: adminLoginResponse.data.data.user.email,
        role: adminLoginResponse.data.data.user.role,
        lastLogin: adminLoginResponse.data.data.user.lastLogin,
      });
      const adminToken = adminLoginResponse.data.token;
      console.log(
        "🔐 Admin Token (first 50 chars):",
        adminToken.substring(0, 50) + "..."
      );
      console.log("");

      // Test 6: Get All Users (Admin Only)
      console.log("6️⃣  Getting All Users (Admin)...");
      try {
        const usersResponse = await axios.get(`${BASE_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        console.log("✅ All Users:", {
          total: usersResponse.data.total,
          count: usersResponse.data.count,
          users: usersResponse.data.data.users.map((user) => ({
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          })),
        });
        console.log("");
      } catch (error) {
        console.log(
          "❌ Get Users failed:",
          error.response?.data || error.message
        );
        console.log("");
      }
    } catch (error) {
      console.log(
        "❌ Admin Login failed:",
        error.response?.data || error.message
      );
      console.log("");
    }

    console.log("🎉 API Testing Complete!");
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
  }
};

// Run tests
testAPI();
