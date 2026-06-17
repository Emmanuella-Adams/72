import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Sleek static health checker
app.get("/api/health", (req, res) => {
  res.json({ status: "72_online", offlineSupport: true });
});

// Vite middleware integration for full-stack build/dev
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server 72 running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Error setting up Vite dev server:", err);
});
