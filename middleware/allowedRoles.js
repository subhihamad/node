const allowedRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }
    next();
  };
};

module.exports = allowedRoles;
