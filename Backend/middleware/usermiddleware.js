const userMiddleware = (req, res, next) => {
    if (req.user.role !== "User") {
      return res.status(403).json({ message: "Access denied. Users only." });
    }
    next();
  };
  
  module.exports = userMiddleware;
  