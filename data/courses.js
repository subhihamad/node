const { body } = require("express-validator");
const courses = [
  { id: 1, title: "Course 1", price: 100 },
  { id: 2, title: "Course 2", price: 200 },
  { id: 3, title: "Course 3", price: 300 },
];

const bodyValidation = body("title")
  .notEmpty()
  .withMessage("Title is required")
  .isLength({ min: 2 })
  .withMessage("Title must be at least 2 characters long");

const priceValidation = body("price")
  .isFloat({ gt: 0 })
  .withMessage("Price must be a positive number");

module.exports = { courses, bodyValidation, priceValidation };
