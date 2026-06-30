const bcrypt = require("bcrypt");
const authRepository = require("../repositories/authRepository");
const authService = require("../services/authService");

jest.mock("bcrypt");

jest.mock("../repositories/authRepository");

test("returns user email and password object when succeed and creates new user in the database", async () => {
  bcrypt.hash.mockResolvedValue("mypassword1234");

  authRepository.createNewUser.mockResolvedValue({
    email: "myemail@gmail.com",
    password: "mypassword1234",
  });

  expect(
    await authService.registerUser("myemail@gmail.com", "mypassword1234"),
  ).toEqual({ email: "myemail@gmail.com", password: "mypassword1234" });
});
