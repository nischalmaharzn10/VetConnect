import jwt from "jsonwebtoken";

// Middleware to check if the user is authenticated
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use the secret from your env variables
    req.user = decoded;  // Attach user data to request
    next();  // Proceed to the next middleware or route
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if the user has the correct role
export const authorize = (roles = []) => {
  return (req, res, next) => {
    // roles is an array of allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient rights" });
    }
    next();
  };
};
