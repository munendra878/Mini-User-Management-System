const app = require("../app");
const connectDb = require("../src/config/db");

let isDbConnected = false;

module.exports = async (req, res) => {
  try {
    // Connect to MongoDB only once
    if (!isDbConnected) {
      await connectDb();
      isDbConnected = true;
    }

    // Only allow GET requests to fetch users
    if (req.method === "GET") {
      const User = require("../src/models/User");
      const users = await User.find({}, "-password"); // exclude passwords
      return res.status(200).json(users);
    }

    // Only allow POST to create a new user
    if (req.method === "POST") {
      const User = require("../src/models/User");
      const { fullName, email, password, role } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: role || "user"
      });

      return res.status(201).json({ 
        message: "User created", 
        user: { id: newUser._id, fullName, email, role: newUser.role } 
      });
    }

    // Method not allowed
    return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error("Users API Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
