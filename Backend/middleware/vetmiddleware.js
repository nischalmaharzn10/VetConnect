const vetMiddleware = (req, res, next) => {
    if (req.user.role !== "Vet") {
      return res.status(403).json({ message: "Access denied. Veterinarians only." });
    }
    next();
  };
  
  module.exports = vetMiddleware;
  