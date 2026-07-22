const { createTestUser, createAccessToken } = require("./auth");
const { createTestStartup } = require("./startup");

async function createStartupWithoutMember() {
  const newUser = {
    email: "samira.cfx@gmail.com",
    password: "samira1234",
    name: "Samira ali",
    userName: "samira12",
  };

  const user = await createTestUser(newUser);

  const token = await createAccessToken(user.id);

  const newStartup = {
    name: "test",
    description: "test description",
  };

  const startup = await createTestStartup(
    newStartup.name,
    newStartup.description,
  );

  return { startupData: startup, userToken: token };
}

module.exports = createStartupWithoutMember;
