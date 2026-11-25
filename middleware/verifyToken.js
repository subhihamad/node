const { httpStatusCodes } = require("../utils/httpStatusCodes.js");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError.js");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: httpStatusCodes.UNAUTHORIZED,
      message: "Authorization header missing or invalid",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = currentUser;
    console.log("Current User:", req.user);
    next();
  } catch (err) {
    throw new AppError(
      "Invalid or expired token",
      401,
      httpStatusCodes.UNAUTHORIZED,
    );
  }

  //req.user = decoded;
};

module.exports = verifyToken;
