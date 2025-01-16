const router = require("express").Router();
const { authGuard } = require("../middleware/authGuard");
const userController = require("../controllers/userController");

router.post("/login", userController.loginUser);

router.post("/create", userController.createUser);

router.post("/forgot_password", userController.forgetPassword);

router.post("/reset_password", userController.resetPassword);

router.get("/get_single_user", authGuard, userController.getSingleUser);

router.put("/update_profile", authGuard, userController.updateProfile);

router.get("/get_all_user", authGuard, userController.getAllUser);
router.post("/getToken", userController.getToken);

module.exports = router;
