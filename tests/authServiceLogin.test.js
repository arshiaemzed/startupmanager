const { login } = require("../services/authService");

const bcrypt = require("bcrypt");

const {
  generateAccessToken,
  genereateRefreshToken,
} = require("../token_generate");

const authRepository = require("../repositories/authRepository");

jest.mock("bcrypt");

jest.mock("../token_generate");

jest.mock("../repositories/authRepository");

test("", async () => {
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
