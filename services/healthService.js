const AppError = require("../customErrors");
const healthRepository = require("../repositories/healthRepository");
const errorCodes = require("../utils/errorCodes");

async function checkHealth() {
  const databaseHealth = await healthRepository.checkHealth();

  if (!databaseHealth) {
    throw new AppError(
      500,
      errorCodes.UNHEALTH_DATABASE,
      "Failed to interact with the database.",
    );
  }
}

module.exports = {
  checkHealth,
};
