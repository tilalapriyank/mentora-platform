import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.ts";
import studentRoutes from "./modules/students/student.routes.ts";
import lessonRoutes from "./modules/lessons/lesson.routes.ts";
import bookingRoutes from "./modules/bookings/booking.routes.ts";
import sessionRoutes from "./modules/sessions/session.routes.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/lessons", lessonRoutes);
app.use("/bookings", bookingRoutes);
app.use("/sessions", sessionRoutes);

export default app;