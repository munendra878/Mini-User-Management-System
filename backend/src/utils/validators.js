const Joi = require("joi");

const passwordRules = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/)
  .message(
    "Password must be at least 8 characters and include upper, lower, number, and special character"
  );

const emailRule = Joi.string().email().lowercase();

exports.signupSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: emailRule.required(),
  password: passwordRules.required(),
});

exports.loginSchema = Joi.object({
  email: emailRule.required(),
  password: Joi.string().required(),
});

exports.updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: emailRule.required(),
});

exports.statusSchema = Joi.object({
  status: Joi.string().valid("active", "inactive").required(),
});

exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordRules.required(),
});

