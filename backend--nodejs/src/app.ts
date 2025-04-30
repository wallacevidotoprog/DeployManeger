import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import routeres from "./router";
import os, { networkInterfaces } from 'os';
import cookieParser from 'cookie-parser'

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
app.use(cookieParser())
app.use(morgan("dev"));
app.use("/api", routeres);
app.use(express.static(path.join(process.cwd(), "/public")));

// Rotas básicas
app.get("/", (req, res) => {
  res.send("deployment-nodejs");
});

function getLocalIP(): string {

  
  // console.log('cpus',os.cpus());
  // console.log('hostname',os.hostname());
  // console.log('totalmem',os.totalmem());
  // console.log('type',os.type());
  // console.log('userInfo',os.userInfo());
  // console.log('uptime',os.uptime());
  // console.log('version',os.version());
  // console.log('tmpdir',os.tmpdir());
  // console.log('platform',os.platform());
  
  const interfaces = networkInterfaces();
  
  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    
    for (const details of iface) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, () => {
  console.log(`✅ Server running on IP:${getLocalIP()} PORT ${PORT}`);
});
