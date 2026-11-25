const express = require("express");
const router = express.Router();
const { bodyValidation, priceValidation } = require("../data/courses.js");
const userRoles = require("../utils/userRoles.js");
const verifyToken = require("../middleware/verifyToken.js");
const allowedRoles = require("../middleware/allowedRoles.js");
const {
  getAllCourses,
  createCourse,
  deleteCourse,
  getCourseById,
  updateCourse,
} = require("../controllers/courses.control.js");

router
  .route("/")
  .get(getAllCourses)
  .post(verifyToken, bodyValidation, priceValidation, createCourse);

router
  .route("/:id")
  .get(getCourseById)
  .patch(bodyValidation, priceValidation, updateCourse)
  .delete(verifyToken, allowedRoles([userRoles.ADMIN, userRoles.MANAGER]), deleteCourse);

module.exports = router;