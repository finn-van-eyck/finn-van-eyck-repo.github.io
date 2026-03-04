import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

//___dirname is de map waarin de file zich bevindt dus in dit geval is dat server/routers 
const machinesPath = path.join(__dirname, "..", "data", "machines.json");
//GET ROUTES
router.get("/machines", (req: Request, res: Response) => {
  const raw = fs.readFileSync(machinesPath, "utf-8");
  const machines = JSON.parse(raw);
  res.json(machines);
});

router.get("/machines/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const raw = fs.readFileSync(machinesPath, "utf-8");
  const machines = JSON.parse(raw);

  const machine = machines.find((m: any) => m.id === id);

  if (!machine) {
    return res.status(404).json({ message: "Machine not found" });
  }

  res.json(machine);
});


//POST routes
router.post("/machines", (req: Request, res: Response) => {
  const { name, zone, status } = req.body;

  // 1) validatie: zijn de verplichte velden er?
  if (!name || !zone || !status) {
    return res.status(400).json({ message: "name, zone en status zijn verplicht" });
  }

  // 2) json lezen
  const raw = fs.readFileSync(machinesPath, "utf-8");
  const machines = JSON.parse(raw);

  // 3) nieuw id maken (hoogste id + 1)
  const newId = machines.length
    ? Math.max(...machines.map((m: any) => m.id)) + 1
    : 1;

  // 4) nieuwe machine maken
  const newMachine = { id: newId, name, zone, status };

  // 5) toevoegen aan array
  machines.push(newMachine);

  // 6) terugschrijven naar json bestand
  fs.writeFileSync(machinesPath, JSON.stringify(machines, null, 4), "utf-8");

  // 7) terugsturen
  res.status(201).json(newMachine);
});

//PATCH routes
router.patch("/machines/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const raw = fs.readFileSync(machinesPath, "utf-8");
  const machines = JSON.parse(raw);

  const index = machines.findIndex((m: any) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Machine not found" });
  }

  // update: neem de bestaande machine en overschrijf met wat in req.body zit
  machines[index] = { ...machines[index], ...req.body };

  fs.writeFileSync(machinesPath, JSON.stringify(machines, null, 4), "utf-8");

  res.json(machines[index]);
});

//DELETE route
router.delete("/machines/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const raw = fs.readFileSync(machinesPath, "utf-8");
  const machines = JSON.parse(raw);

  const index = machines.findIndex((m: any) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Machine not found" });
  }

  // verwijder 1 item op die index
  machines.splice(index, 1);

  fs.writeFileSync(machinesPath, JSON.stringify(machines, null, 4), "utf-8");

  res.json({ message: "Machine deleted" });
});
export default router;