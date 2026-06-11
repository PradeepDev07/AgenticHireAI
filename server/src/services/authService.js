import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signUser(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "7d"
  });
}

export async function signup(payload) {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    const error = new Error("Email already registered");
    error.status = 409;
    throw error;
  }

  const password = await bcrypt.hash(payload.password, 12);
  const user = await User.create({ ...payload, password });
  const token = signUser(user);
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = signUser(user);
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}
