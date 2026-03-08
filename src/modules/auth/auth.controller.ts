import type { Request, Response } from "express";
import * as authService from "./auth.service.ts";

export async function signup(req: Request, res: Response) {
  try {
    const result = await authService.signup(req.body);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export function me(req: any, res: Response) {
  res.json(req.user);
}