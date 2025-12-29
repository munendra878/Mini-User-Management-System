const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = "test-secret";

const app = require("../../app");
const User = require("../models/User");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

const strongPassword = "Str0ng@Pass";

test("Signup returns token and user", async () => {
  const res = await request(app).post("/api/auth/signup").send({
    fullName: "Test User",
    email: "test@mail.com",
    password: strongPassword,
  });

  expect(res.statusCode).toBe(201);
  expect(res.body.token).toBeDefined();
  expect(res.body.user.email).toBe("test@mail.com");
});

test("Signup rejects weak password", async () => {
  const res = await request(app).post("/api/auth/signup").send({
    fullName: "Weak User",
    email: "weak@mail.com",
    password: "weak",
  });

  expect(res.statusCode).toBe(400);
});

test("Login succeeds with valid credentials", async () => {
  await request(app).post("/api/auth/signup").send({
    fullName: "Login User",
    email: "login@mail.com",
    password: strongPassword,
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "login@mail.com",
    password: strongPassword,
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeDefined();
});

test("Login blocks inactive account", async () => {
  const hashed = await bcrypt.hash(strongPassword, 10);
  await User.create({
    fullName: "Inactive User",
    email: "inactive@mail.com",
    password: hashed,
    status: "inactive",
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "inactive@mail.com",
    password: strongPassword,
  });

  expect(res.statusCode).toBe(403);
});

test("Authenticated user can get their profile", async () => {
  const signup = await request(app).post("/api/auth/signup").send({
    fullName: "Profile User",
    email: "profile@mail.com",
    password: strongPassword,
  });

  const res = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${signup.body.token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.user.email).toBe("profile@mail.com");
});

test("Admin can list users", async () => {
  const hashed = await bcrypt.hash(strongPassword, 10);
  await User.create({
    fullName: "Admin",
    email: "admin@mail.com",
    password: hashed,
    role: "admin",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "admin@mail.com",
    password: strongPassword,
  });

  const token = loginRes.body.token;

  await User.create({
    fullName: "User B",
    email: "userb@mail.com",
    password: hashed,
  });

  const res = await request(app)
    .get("/api/users")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.meta).toBeDefined();
});
