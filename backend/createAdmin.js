require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./src/models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@example.com";
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      return;
    }

    const passwordHash = await bcrypt.hash("Admin@123", 10); // change password as needed

    await User.create({
      fullName: "Admin User",
      email,
      password: passwordHash,
      role: "admin",
      status: "active",
    });

    console.log("Admin user created");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();