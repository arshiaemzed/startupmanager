const express = require("express");
const router = express.Router();
const signupMiddleware = require("../middlewares/signupMiddleware");
const loginMiddleware = require("../middlewares/loginMiddleware");
const refreshTokenMiddleware = require("../middlewares/refreshTokenMiddleware");
const logoutMiddleware = require("../middlewares/logoutMiddleware");
const authController = require("../controllers/authController");
const verifyJWT = require("../middlewares/jwt");
const asyncHandler = require("../middlewares/asyncHandler");
const loginRateLimit = require("../middlewares/ratelimit/loginRateLimit");
const signupRateLimit = require("../middlewares/ratelimit/signupRateLimit");
const refreshRateLimit = require("../middlewares/ratelimit/refreshRateLimit");

router.post(
  "/auth/signup",
  signupRateLimit,
  signupMiddleware,
  asyncHandler(authController.signup),
);

router.post(
  "/auth/login",
  loginRateLimit,
  loginMiddleware,
  asyncHandler(authController.login),
);

router.post(
  "/auth/refresh",
  refreshRateLimit,
  refreshTokenMiddleware,
  asyncHandler(authController.refreshJWT),
);

router.get("/auth/profile", verifyJWT, asyncHandler(authController.getProfile));

router.post(
  "/auth/logout",
  logoutMiddleware,
  asyncHandler(authController.logout),
);

module.exports = router;
