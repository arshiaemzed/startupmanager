const {
  generateAccessToken,
  genereateRefreshToken,
} = require("../token_generate");

const jwt = require("jsonwebtoken");

const AppError = require("../customErrors");
const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");
const errorCodes = require("../utils/errorCodes");

async function registerUser(email, password, displayName, userName) {
  const userEmail = email.trim();
  const userPassword = password.trim();
  const userDisplayName = displayName;
  const theUserName = userName.trim();

  const SALT_ROUNDS = 10;

  const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);

  const userExists = await authRepository.findUser(userEmail);

  if (userExists) {
    throw new AppError(
      400,
      errorCodes.USER_ALREADY_REGISTERED,
      "User already registered.",
    );
  }

  const userNameTaken = await authRepository.isUserNameTaken(theUserName);

  if (userNameTaken) {
    throw new AppError(
      400,
      errorCodes.USER_NAME_TAKEN,
      "User name already taken.",
    );
  }

  const newUser = await authRepository.createNewUser(
    userEmail,
    hashedPassword,
    userDisplayName,
    theUserName,
  );

  return {
    name: newUser.name,
    userName: newUser.user_name,
    email: newUser.email,
  };
}

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

  await authRepository.storeRefreshToken(user.id, refreshToken.jti);

  return {
    access_token: accessToken,
    refresh_token: refreshToken.refreshToken,
  };
}

async function logout(refreshToken) {
  const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

  const valid = await authRepository.isRefreshTokenValid(user.jti);

  if (!valid) {
    throw new AppError(
      401,
      errorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
      "didnt found the damn token in the database alright ?",
    );
  }

  const deletedToken = await authRepository.deleteRefreshToken(user.jti);

  return deletedToken;
}

async function refresh(refreshToken) {
  try {
    const refreshTokenData = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
    );

    const oldJTI = refreshTokenData.jti;

    const isRefreshTokenValid =
      await authRepository.isRefreshTokenValid(oldJTI);

    if (!isRefreshTokenValid) {
      throw new AppError(
        401,
        errorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
        "Invalid or exipred refresh token.",
      );
    }

    const newRefreshToken = genereateRefreshToken(refreshTokenData);
    const newAccessToken = generateAccessToken(refreshTokenData);
    const newJTI = newRefreshToken.jti;

    await authRepository.rotateRefreshToken(
      refreshTokenData.id,
      oldJTI,
      newJTI,
    );

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken.refreshToken,
    };
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
