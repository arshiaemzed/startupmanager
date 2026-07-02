const {
  generateAccessToken,
  genereateRefreshToken,
} = require("../token_generate");

const AppError = require("../customErrors");
const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");

async function registerUser(email, password) {
  const SALT_ROUNDS = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return await authRepository.createNewUser(email, hashedPassword);
}

/**
 * verifies user email and password and generates JWT tokens for authentication
 * token types => access token and refresh token
 * access token is used for authentication
 * refresh token is used for regenerating access tokens
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<accessToken: string, refreshToken: string>}
 */
async function login(email, password) {
  const user = await authRepository.findUser(email);

  if (!user) {
    throw new AppError(401, "Invalid credentials.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError(401, "Invalid credentials.");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = genereateRefreshToken(user);

  await authRepository.storeRefreshToken(user.id, refreshToken);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

/**
 * Logs out a user by invalidating their refresh token
 *
 * This prevents further access to generating access tokens with the same refresh token
 *
 * @param {string} userId
 * @param {string} refreshToken
 * @returns {Promise<message: string>}
 */
async function logout(userId, refreshToken) {
  const verifyRefreshToken = await authRepository.isRefreshTokenValid(
    userId,
    refreshToken,
  );

  if (!verifyRefreshToken) {
    throw new AppError(401, "Refresh token is not valid");
  }

  const deletedRefreshToken = await authRepository.deleteRefreshToken(
    userId,
    refreshToken,
  );

  if (!deletedRefreshToken) {
    throw new AppError(401, "Failed to delete refresh token");
  }

  return { message: "Successfully logged out and killed the refresh token" };
}

module.exports = {
  registerUser,
  login,
  logout,
};
