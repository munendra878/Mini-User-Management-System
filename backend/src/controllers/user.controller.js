const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sanitizeUser } = require("./auth.controller");

exports.listUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select("-password"),
      User.countDocuments(),
    ]);

    res.json({
      data: users.map(sanitizeUser),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({ message: "Status updated", user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res) => {
  res.json({ user: sanitizeUser(req.userDoc) });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, email } = req.body;

    const duplicate = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (duplicate) {
      return res.status(400).json({ message: "Email already in use" });
    }

    req.userDoc.fullName = fullName;
    req.userDoc.email = email;
    await req.userDoc.save();

    res.json({ message: "Profile updated", user: sanitizeUser(req.userDoc) });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(currentPassword, req.userDoc.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    req.userDoc.password = await bcrypt.hash(newPassword, 10);
    await req.userDoc.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

