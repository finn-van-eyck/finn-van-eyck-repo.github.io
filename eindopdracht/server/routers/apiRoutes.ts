import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const machinesPath = path.join(__dirname, "..", "data", "machines.json");

// GET /api/machines
router.get("/machines", (req: Request, res: Response) => {
  const raw = fs.readFileSync(machinesPath, "utf-8");
  const machines = JSON.parse(raw);
  res.json(machines);
});

// GET /api/machines/:id
router.get("/machines/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const raw = fs.readFileSync(machinesPath, "utf-8");
  const machines = JSON.parse(raw);

  const machine = machines.find((m: any) => m.id === id);
  if (!machine) return res.status(404).json({ message: "Machine not found" });

  res.json(machine);
});

export default router;