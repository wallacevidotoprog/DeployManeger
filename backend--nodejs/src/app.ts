import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { networkInterfaces } from "os";
import path from "path";
import routeres from "./router";
// import routeres from "./router";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:4200", "http://192.168.1.7:3000", "http://localhost:3000", "http://10.0.2.15:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static(path.join(process.cwd(), "/public")));
app.use("/api", routeres);
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "/public", "index.html"));
// });

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
      if (details.family === "IPv4" && !details.internal) {
        return details.address;
      }
    }
  }
  return "localhost";
}

app.listen(PORT, () => {
  console.log(`✅ Server running on IP:${getLocalIP()} PORT ${PORT}`);
});
