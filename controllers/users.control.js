const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { User } = require("../models/users.model.js");
const { httpStatusCodes } = require("../utils/httpStatusCodes.js");
const asyncWrapper = require("../middleware/asyncWrapper.js");
const AppError = require("../utils/appError.js");
const generateJWT = require("../utils/generateJWT.js");

const validateCredentials = (email, password) => {
  if (!email || !password) {
    throw new AppError(
      "Email and password are required",
      400,
      httpStatusCodes.BAD_REQUEST,
    );
  }
};

const getAllUsers = async (req, res) => {
  const query = req.query;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const page = query.page ? parseInt(query.page) : 1;
  const users = await User.find({}, { password: false, __v: false })
    .limit(limit)
    .skip((page - 1) * limit);

  res.status(200).json({
    status: httpStatusCodes.SUCCESS,
    message: "Users retrieved successfully",
    count: users.length,
    data: { users },
  });
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      "Validation failed",
      400,
      httpStatusCodes.BAD_REQUEST,
      errors.array(),
    );
  }

  const { firstName, lastName, Email, email, password, role, avatar } = req.body;
  const normalizedEmail = (Email || email || "").trim().toLowerCase();
  console.log("Request file", req.file);

  const existingUser = await User.findOne({ Email: normalizedEmail });
  if (existingUser) {
    throw new AppError(
      "Email is already registered",
      400,
      httpStatusCodes.BAD_REQUEST,
    );
  }

  const user = await new User({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    Email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    avatar: req.file ? req.file.filename : "uploads/avatar.png",
    role: role,
  });

  const token = await generateJWT({
    id: user._id,
    Email: user.Email,
    role: user.role,
  });
  user.token = token;
  await user.save();

  res.status(201).json({
    status: httpStatusCodes.CREATED,
    message: "User registered successfully",
    token,
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        Email: user.Email,
        role: user.role,
        avatar: user.avatar,
      },
    },
  });
};

const login = async (req, res) => {
  const { Email, email, password } = req.body;
  const normalizedEmail = (Email || email || "").trim().toLowerCase();
  validateCredentials(normalizedEmail, password);

  const user = await User.findOne({ Email: normalizedEmail });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(
      "Invalid email or password",
      401,
      httpStatusCodes.UNAUTHORIZED,
    );
  }

  const token = await generateJWT({
    id: user._id,
    Email: user.Email,
    role: user.role,
  });
  user.token = token;
  await user.save();

  res.status(200).json({
    status: httpStatusCodes.SUCCESS,
    message: "Login successful",
    token,
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        Email: user.Email,
        role: user.role,
      },
    },
  });
};

module.exports = {
  getAllUsers: asyncWrapper(getAllUsers),
  register: asyncWrapper(register),
  login: asyncWrapper(login),
};
