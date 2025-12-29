const express = require("express");
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { signupSchema, loginSchema } = require("../utils/validators");

const router = express.Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", auth, authController.me);
router.post("/logout", auth, authController.logout);

module.exports = router;
