// Custom error class for application-specific errors
class AppError extends Error {
  constructor(message, statusCode, statusText, errors) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

