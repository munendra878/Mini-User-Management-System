const mongoose = require("mongoose");

async function connectDb(uri = process.env.MONGO_URI) {
  if (!uri) throw new Error("MONGO_URI is not set in environment variables");

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

  const { host, port, name } = mongoose.connection;
  console.log(`MongoDB connected at ${host}:${port}/${name}`);

  return mongoose.connection;
}

module.exports = connectDb;
