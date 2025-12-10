const mongoose = require("mongoose");
const User = require("./models/User");
const config = require("./config/config");

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log("MongoDB Connected");

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super_admin" });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists:", existingSuperAdmin.email);
      return;
    }

    // Create super admin
    const superAdmin = await User.create({
      name: "Super Administrator",
      email: "admin@sportsmanagement.com",
      password: "admin123", // This will be hashed automatically
      role: "super_admin",
    });

    console.log("Super Admin created successfully:");
    console.log("Email:", superAdmin.email);
    console.log("Password: admin123");
    console.log("Please change the password after first login!");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
  } finally {
    mongoose.disconnect();
  }
};

// Run the seeder
createSuperAdmin();
