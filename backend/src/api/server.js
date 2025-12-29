require("dotenv").config();
const app = require("../../app");
const connectDb = require("../config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
