const healthService = require("../services/healthService");

async function checkHealth(req, res) {
  await healthService.checkHealth();

  return res.json({ success: true });
}

module.exports = {
  checkHealth,
};
