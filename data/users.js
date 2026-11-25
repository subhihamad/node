const { body } = require("express-validator");
const validator = require("validator");

const firstNameValidation = body("firstName")
  .isString()
  .withMessage("First name must be a string")
  .trim()
  .notEmpty()
  .withMessage("First name is required");

const lastNameValidation = body("lastName")
  .isString()
  .withMessage("Last name must be a string")
  .trim()
  .notEmpty()
  .withMessage("Last name is required");

const emailValidation = body("Email")
  .custom((value, { req }) => {
    const email = value || req.body.email;
    return typeof email === "string" && validator.isEmail(email.trim());
  })
  .withMessage("Please enter a valid email");

const passwordValidation = body("password")
  .isString()
  .withMessage("Password must be a string")
  .notEmpty()
  .withMessage("Password is required");

module.exports = {
  firstNameValidation,
  lastNameValidation,
  emailValidation,
  passwordValidation,
};