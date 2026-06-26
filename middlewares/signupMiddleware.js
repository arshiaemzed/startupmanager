function signupMiddleware(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email != "string") {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password || typeof password != "string") {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password length must be more than 6" });
  }

  next();
}

module.exports = signupMiddleware;
