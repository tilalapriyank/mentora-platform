import prisma from "../../config/prisma.ts";
import { hashPassword, comparePassword } from "../../utils/password.ts";
import { generateToken } from "../../utils/jwt.ts";

const ALLOWED_ROLES = ["PARENT", "MENTOR"] as const;

export async function signup(data: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
}) {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password = typeof data.password === "string" ? data.password : "";
  const role = typeof data.role === "string" ? data.role.toUpperCase() : "";

  if (!name) throw new Error("Name is required");
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");
  if (!ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
    throw new Error("Role must be PARENT or MENTOR. Students are created by parents.");
  }

  const hashed = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashed,
        role: role as "PARENT" | "MENTOR",
      },
    });
    return { token: generateToken(user) };
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") throw new Error("Email already registered");
    throw e;
  }
}

export async function login(data: { email?: unknown; password?: unknown }) {
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password = typeof data.password === "string" ? data.password : "";

  if (!email || !password) throw new Error("Email and password are required");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("Invalid credentials");

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  return { token: generateToken(user) };
}