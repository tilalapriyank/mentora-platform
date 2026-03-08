import type { Request, Response } from "express";
import prisma from "../../config/prisma.ts";

export async function createSession(req: Request, res: Response) {
  try {
    const user = (req as Request & { user: { id: string } }).user;
    const lessonId = req.body?.lessonId;
    const dateRaw = req.body?.date;
    const topic = req.body?.topic;
    const summary = req.body?.summary;

    if (!lessonId || typeof lessonId !== "string" || !lessonId.trim()) {
      return res.status(400).json({ error: "lessonId is required" });
    }
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ error: "topic is required" });
    }

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId.trim(), mentorId: user.id },
    });
    if (!lesson) {
      return res.status(403).json({ error: "Lesson not found or you are not the mentor" });
    }

    const date = dateRaw ? new Date(dateRaw) : new Date();
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const data: { lessonId: string; date: Date; topic: string; summary?: string } = {
      lessonId: lesson.id,
      date,
      topic: topic.trim(),
    };
    if (typeof summary === "string" && summary.trim()) {
      data.summary = summary.trim();
    }
    const session = await prisma.session.create({ data });

    res.status(201).json(session);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export async function getLessonSessions(req: Request, res: Response) {
  const lessonId = req.params?.id;
  if (typeof lessonId !== "string" || !lessonId.trim()) {
    return res.status(400).json({ error: "Lesson id is required" });
  }

  const sessions = await prisma.session.findMany({
    where: { lessonId: lessonId.trim() },
    orderBy: { date: "asc" },
  });

  res.json(sessions);
}