const jwt = require("jsonwebtoken");
const AppError = require("./appError.js");
const { httpStatusCodes } = require("./httpStatusCodes.js");

const generateJWT = async (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(
      "JWT_SECRET is not configured",
      500,
      httpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = generateJWT;
