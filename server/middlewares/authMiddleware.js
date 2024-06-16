const jwt = require("jsonwebtoken");
require("dotenv").config();
const passKey = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.query.token;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    jwt.verify(token, passKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

module.exports = authenticateUser;