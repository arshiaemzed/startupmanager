const express = require("express");
const verifyJWT = require("../middlewares/jwt");

const router = express.Router();

router.get("/startup/:id/members", verifyJWT);

module.exports = router;
