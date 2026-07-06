import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { showsRouter } from "./routes/shows";
import { libraryRouter } from "./routes/library";
import { episodesRouter } from "./routes/episodes";
import { statsRouter } from "./routes/stats";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/shows", showsRouter);
app.use("/api/library", libraryRouter);
app.use("/api/episodes", episodesRouter);
app.use("/api/stats", statsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`TV Time API listening on http://localhost:${port}`);
});
