function loginMiddleware(req, res, next) {
  const { email, password } = req.body;

  if (!email || email.trim() === "" || typeof password != "string") {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!password || email.trim() === "" || typeof password != "string") {
    return res.status(400).json({ message: "Invalid password" });
  }
  next();
}

module.exports = loginMiddleware;
