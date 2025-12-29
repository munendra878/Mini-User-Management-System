const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const {
  statusSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require("../utils/validators");
const userController = require("../controllers/user.controller");

router.get("/", auth, role("admin"), userController.listUsers);
router.patch(
  "/:id/status",
  auth,
  role("admin"),
  validate(statusSchema),
  userController.updateStatus
);

router.get("/me", auth, userController.getProfile);
router.put("/me", auth, validate(updateProfileSchema), userController.updateProfile);
router.patch(
  "/me/password",
  auth,
  validate(changePasswordSchema),
  userController.changePassword
);

module.exports = router;
