import prisma from "../../config/prisma.ts";
import { hashPassword, comparePassword } from "../../utils/password.ts";
import { generateToken } from "../../utils/jwt.ts";

export async function signup(data: any) {
  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashed,
      role: data.role,
    },
  });

  const token = generateToken(user);

  return { token };
}

export async function login(data: any) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("Invalid credentials");

  const valid = await comparePassword(data.password, user.passwordHash);

  if (!valid) throw new Error("Invalid credentials");

  const token = generateToken(user);

  return { token };
}