const app = require("../app");
const connectDb = require("../src/config/db");

let isDbConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isDbConnected) {
      await connectDb(); // Connect once per cold start
      isDbConnected = true;
    }
    app(req, res); // Let Express handle the route
  } catch (err) {
    console.error("Serverless Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

