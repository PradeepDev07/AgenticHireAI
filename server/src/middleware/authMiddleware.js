import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      const error = new Error("Authentication required");
      error.status = 401;
      throw error;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      const error = new Error("Insufficient permissions");
      error.status = 403;
      return next(error);
    }
    next();
  };
}
