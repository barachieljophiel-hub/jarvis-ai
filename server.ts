import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
const execPromise = promisify(exec);
const root = process.cwd();

async function getFileList(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const resolvedPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFileList(resolvedPath));
    } else if (entry.isFile()) {
      files.push(path.relative(root, resolvedPath));
    }
  }

  return files;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get("/api/system/stats", (req, res) => {
    res.json({
      platform: os.platform(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      uptime: os.uptime(),
      arch: os.arch(),
      cpus: os.cpus().length,
    });
  });

  app.post("/api/execute", async (req, res) => {
    const command = String(req.body?.command || "").trim();

    if (!command) {
      return res.status(400).json({ error: "Le champ 'command' est requis." });
    }

    if (command.length > 1024) {
      return res.status(400).json({ error: "La commande est trop longue." });
    }

    try {
      const { stdout, stderr } = await execPromise(command, { cwd: root, windowsHide: true });
      res.json({ stdout, stderr });
    } catch (error) {
      console.error("Erreur d'exécution de commande:", error);
      res.status(500).json({ error: error?.message ?? "Erreur inconnue lors de l'exécution." });
    }
  });

  app.get("/api/files", async (req, res) => {
    try {
      const files = await getFileList(root);
      res.json({ files });
    } catch (error) {
      console.error("Erreur de lecture des fichiers:", error);
      res.status(500).json({ error: "Impossible de lister les fichiers." });
    }
  });

  const vite = await createViteServer({
    root,
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  app.listen(3000, "0.0.0.0", () => {
    console.log("JARVIS initialisé sur http://localhost:3000");
  });
}

startServer();