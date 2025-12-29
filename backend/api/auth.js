const app = require("../app");
const connectDb = require("../src/config/db");

let isDbConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isDbConnected) {
      await connectDb();
      isDbConnected = true;
    }
    app(req, res);  // Your Express app handles /auth routes
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
