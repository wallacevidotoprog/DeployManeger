import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import routeres from "./router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routeres);
app.use(express.static(path.join(process.cwd(), "/public")));

// Rotas básicas
app.get("/", (req, res) => {
  res.send("deployment-nodejs");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
