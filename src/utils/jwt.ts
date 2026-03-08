import jwt from "jsonwebtoken";

export function generateToken(user: { id: string; role: string; email: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}