import type { Request, Response } from "express";
import prisma from "../../config/prisma.ts";

export async function createBooking(req: Request, res: Response) {
  try {
    const user = (req as Request & { user: { id: string } }).user;
    const studentId = req.body?.studentId;
    const lessonId = req.body?.lessonId;

    if (!studentId || typeof studentId !== "string" || !studentId.trim()) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!lessonId || typeof lessonId !== "string" || !lessonId.trim()) {
      return res.status(400).json({ error: "lessonId is required" });
    }

    const student = await prisma.student.findFirst({
      where: { id: studentId.trim(), parentId: user.id },
    });
    if (!student) {
      return res.status(403).json({ error: "Student not found or you are not the parent" });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId.trim() },
    });
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: student.id,
        lessonId: lesson.id,
      },
    });

    res.status(201).json(booking);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Student is already booked for this lesson" });
    }
    res.status(400).json({ error: (e as Error).message });
  }
}