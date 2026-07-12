const {
  generateAccessToken,
  genereateRefreshToken,
} = require("../token_generate");

const jwt = require("jsonwebtoken");

const AppError = require("../customErrors");
const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");
const errorCodes = require("../utils/errorCodes");

async function registerUser(email, password, displayName) {
  const SALT_ROUNDS = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return await authRepository.createNewUser(email, hashedPassword, displayName);
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
    throw new AppError(
      401,
      errorCodes.INVALID_CREDENTIALS,
      "Invalid credentials.",
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError(
      401,
      errorCodes.INVALID_CREDENTIALS,
      "Invalid credentials.",
    );
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
async function logout(refreshToken) {
  const exists = await authRepository.isRefreshTokenValid(refreshToken);

  if (!exists) {
    throw new AppError(
      401,
      errorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
      "Refresh token is not valid",
    );
  }

  try {
    jwt.verify(refreshToken, "REFRESH_SECRET_1234");
  } catch (error) {
    throw new AppError(
      401,
      errorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
      "Invalid or expired refresh token",
    );
  }

  const deletedRefreshToken =
    await authRepository.deleteRefreshToken(refreshToken);

  if (!deletedRefreshToken) {
    throw new AppError(
      401,
      errorCodes.FAILED_TO_DELETE_REFRESH_TOKEN,
      "Failed to delete refresh token",
    );
  }

  return { message: "Successfully logged out and killed the refresh token" };
}

async function refresh(refreshToken) {
  const validRefreshToken =
    await authRepository.isRefreshTokenValid(refreshToken);

  if (!validRefreshToken) {
    throw new AppError(
      400,
      errorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
      "Invalid refresh token.",
    );
  }

  try {
    const userData = jwt.verify(refreshToken, "REFRESH_SECRET_1234");
    const newAccessToken = generateAccessToken(userData);

    return newAccessToken;
  } catch (error) {
    throw new AppError(
      401,
      errorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
      "Invalid or exipred refresh token.",
    );
  }
}

module.exports = {
  registerUser,
  login,
  logout,
  refresh,
};
