const express = require("express");
const router = express.Router();
const signupMiddleware = require("../middlewares/signupMiddleware");
const loginMiddleware = require("../middlewares/loginMiddleware");
const authController = require("../controllers/authController");
const verifyJWT = require("../middlewares/jwt");
const asyncHandler = require("../middlewares/asyncHandler");

router.post(
  "/auth/signup",
  signupMiddleware,
  asyncHandler(authController.signup),
);

router.post("/auth/login", loginMiddleware, asyncHandler(authController.login));

router.post("/auth/refresh", asyncHandler(authController.refreshJWT));

router.get("/profile", verifyJWT, asyncHandler(authController.getProfile));

router.post("/auth/logout", asyncHandler(authController.logout));

module.exports = router;
