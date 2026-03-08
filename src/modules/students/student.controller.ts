import type { Request, Response } from "express";
import prisma from "../../config/prisma.ts";

export async function createStudent(req: Request, res: Response) {
  try {
    const user = (req as Request & { user: { id: string } }).user;
    const name = req.body?.name;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        parentId: user.id,
      },
    });

    res.status(201).json(student);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export async function getStudents(req: Request, res: Response) {
  const user = (req as Request & { user: { id: string } }).user;
  const students = await prisma.student.findMany({
    where: { parentId: user.id },
  });

  res.json(students);
}