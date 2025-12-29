const app = require("../app");
const connectDb = require("../src/config/db");

let isDbConnected = false;

// Handler for Vercel serverless
module.exports = async (req, res) => {
  try {
    if (!isDbConnected) {
      await connectDb();
      isDbConnected = true;
    }
    app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
