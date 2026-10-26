import jwt from "jsonwebtoken";

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!process.env.JWT_KEY) {
    return res.status(503).json({
      message: "Authentication is not configured. Set JWT_KEY in the deployment environment.",
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_KEY);
    if (typeof user === "string" || user.role !== "admin") {
      return res.status(403).json({ message: "Administrator access required" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default requireAdmin;
