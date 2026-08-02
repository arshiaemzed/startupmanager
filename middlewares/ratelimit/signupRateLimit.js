const expressLimiter = require("express-rate-limit");

module.exports = expressLimiter.rateLimit({
  windowMs: 1000 * 60 * 15,
  limit: 10,
  legacyHeaders: false,
  standardHeaders: "draft-8",
});
