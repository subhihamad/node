const express = require("express");
const router = express.Router();
const multer = require("multer");
const AppError = require("../utils/appError.js");

const diskStoeage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File", file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop(),
    );
  },
});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  // Accept only image files (jpeg, png, gif)
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed!", 400, 400), false);
  }
};

// Create the multer instance with the storage and file filter
const upload = multer({ storage: diskStoeage, fileFilter: fileFilter });

const {
  firstNameValidation,
  lastNameValidation,
  emailValidation,
  passwordValidation,
} = require("../data/users.js");
const {
  getAllUsers,
  register,
  login,
} = require("../controllers/users.control.js");
const verifyToken = require("../middleware/verifyToken.js");

router.route("/").get(verifyToken, getAllUsers);

router.post(
  "/register",
  upload.single("avatar"),
  firstNameValidation,
  lastNameValidation,
  emailValidation,
  passwordValidation,
  register,
);
router.post("/login", login);

module.exports = router;
