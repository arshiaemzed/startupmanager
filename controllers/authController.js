const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

const { generateAccessToken } = require("../token_generate");
const { user } = require("pg/lib/defaults");

async function signup(req, res, next) {
  const { email, password } = req.body;

  const user = await authService.registerUser(email, password);

  return res.status(201).json(user);
}

async function login(req, res, next) {
  const token = await authService.login(req.body.email, req.body.password);

  return res.status(200).json(token);
}

async function refreshJWT(req, res, next) {
  const refreshToken = req.headers.authorization.split(" ")[1];

  const newAccessToken = await authService.refresh(refreshToken);

  return res.status(200).json({ access_token: newAccessToken });
}

function getProfile(req, res, next) {
  const userId = req.user.id;
  const userEmail = req.user.email;

  return res.status(200).json({ userId: userId, userEmail: userEmail });
}

async function logout(req, res, next) {
  const refreshToken = req.headers.authorization.split(" ")[1];
  const logout = await authService.logout(refreshToken);
  return res.status(200).json(logout);
}

module.exports = {
  login,
  logout,
  getProfile,
  refreshJWT,
  signup,
};
