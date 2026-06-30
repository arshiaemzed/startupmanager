const { login } = require("../services/authService");

const bcrypt = require("bcrypt");

const {
  generateAccessToken,
  genereateRefreshToken,
} = require("../token_generate");

const authRepository = require("../repositories/authRepository");
const AppError = require("../customErrors");

jest.mock("bcrypt");

jest.mock("../token_generate");

jest.mock("../repositories/authRepository");

test("returns accessToken and refreshToken when succeeding", async () => {
  await authRepository.findUser.mockResolvedValue({
    id: 1,
    email: "test@gmail.com",
    password: "test1234",
  });

  await bcrypt.compare.mockResolvedValue(true);

  generateAccessToken.mockReturnValue("test_access_token");

  genereateRefreshToken.mockReturnValue("test_refresh_token");

  authRepository.storeRefreshToken.mockResolvedValue("test");

  expect(await login("test@gmail.com", "test1234")).toEqual({
    accessToken: "test_access_token",
    refreshToken: "test_refresh_token",
  });
});

test("throw AppError object when password doesnt match", async () => {
  bcrypt.compare.mockResolvedValue(false);

  expect(await login("test@gmail.com", "test1234")).toEqual(
    new AppError(401, "Invalid credentials."),
  );
});
