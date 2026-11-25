// This middleware function wraps asynchronous route handlers to catch errors and pass them to the next middleware (error handler).
module.exports = function asyncWrapper(fn) {
  return async function (req, res, next) {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error);
    }
  };
};