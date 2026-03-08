import type { Request, Response } from "express";
import prisma from "../../config/prisma.ts";

export async function createLesson(req: Request, res: Response) {
  try {
    const user = (req as Request & { user: { id: string } }).user;
    const title = req.body?.title;
    const description = req.body?.description;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ error: "Description is required" });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        mentorId: user.id,
      },
    });

    res.status(201).json(lesson);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}