const { validationResult } = require("express-validator");
const { Course } = require("../models/courses.model.js");
const { httpStatusCodes } = require("../utils/httpStatusCodes.js");
const asyncWrapper = require("../middleware/asyncWrapper.js");
const AppError = require("../utils/appError.js");

const getAllCourses = async (req, res) => {
  const query = req.query;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const page = query.page ? parseInt(query.page) : 1;
  console.log("Query parameters:", query);
  const courses = await Course.find({}, { "__v": false })
    .limit(limit)
    .skip((page - 1) * limit);
  
  res.status(200).json({
    status: httpStatusCodes.SUCCESS,
    message: "Courses retrieved successfully",
    count: courses.length,
    data: { courses },
  });
};

const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new AppError("Course not found", 404, httpStatusCodes.NOT_FOUND);
  }

  res.status(200).json({
    status: httpStatusCodes.SUCCESS,
    message: "Course retrieved successfully",
    data: { course },
  });
};

const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      "Validation failed",
      400,
      httpStatusCodes.BAD_REQUEST,
      errors.array(),
    );
  }

  const { title, price } = req.body;
  const course = await new Course({ title, price }).save();
  res.status(201).json({
    status: httpStatusCodes.CREATED,
    message: "Course created successfully",
    data: { course },
  });
};

const updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      "Validation failed",
      400,
      httpStatusCodes.BAD_REQUEST,
      errors.array(),
    );
  }

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: { ...req.body } },
    { returnDocument: "after" },
  );
  if (!course) {
    throw new AppError("Course not found", 404, httpStatusCodes.NOT_FOUND);
  }

  res.status(200).json({
    status: httpStatusCodes.SUCCESS,
    message: "Course updated successfully",
    data: { course },
  });
};

const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    throw new AppError("Course not found", 404, httpStatusCodes.NOT_FOUND);
  }

  res.status(200).json({
    status: httpStatusCodes.SUCCESS,
    message: "Course deleted successfully",
    data: { course },
  });
};

module.exports = {
  getAllCourses: asyncWrapper(getAllCourses),
  getCourseById: asyncWrapper(getCourseById),
  createCourse: asyncWrapper(createCourse),
  updateCourse: asyncWrapper(updateCourse),
  deleteCourse: asyncWrapper(deleteCourse),
};
