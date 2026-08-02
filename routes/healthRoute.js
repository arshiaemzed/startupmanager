const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const healthController = require("../controllers/healthController");
const router = express.Router();
const healthRateLimit = require("../middlewares/ratelimit/healthRateLimit");

router.get(
  "/health",
  healthRateLimit,
  asyncHandler(healthController.checkHealth),
);

module.exports = router;
