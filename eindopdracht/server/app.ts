import express, { Application } from "express";
import path from "path";
import routes from "./routers/routes";
import apiRoutes from "./routers/apiRoutes";

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});