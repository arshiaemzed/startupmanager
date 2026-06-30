const authRepositry = require("../repositories/authRepository");
const { logout } = require("../services/authService");

jest.mock("../repositories/authRepository");

test("returns a obeject with success message when succeed and deletes refresh token from database", async () => {
  authRepositry.isRefreshTokenValid.mockResolvedValue(true);

  authRepositry.deleteRefreshToken.mockResolvedValue(true);

  expect(await logout("test", "test")).toEqual({
    message: "Successfully logged out and killed the refresh token",
  });
});
