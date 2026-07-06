import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { searchShows, listPopularShows, usingMockData } from "../services/tmdb";
import { getOrCacheShow } from "../services/showCache";

export const showsRouter = Router();

showsRouter.get("/search", requireAuth, async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  try {
    const results = q ? await searchShows(q) : await listPopularShows();
    res.json({ results, usingMockData: usingMockData() });
  } catch (err) {
    res.status(502).json({ error: "Failed to reach TMDB", detail: (err as Error).message });
  }
});

showsRouter.get("/:tmdbId", requireAuth, async (req: AuthedRequest, res) => {
  const tmdbId = Number(req.params.tmdbId);
  if (!Number.isInteger(tmdbId)) return res.status(400).json({ error: "Invalid show id" });

  const show = await getOrCacheShow(tmdbId);
  if (!show) return res.status(404).json({ error: "Show not found" });

  const [libraryEntry, watched] = await Promise.all([
    prisma.libraryEntry.findUnique({
      where: { userId_showId: { userId: req.userId!, showId: show.id } },
    }),
    prisma.watchedEpisode.findMany({
      where: { userId: req.userId!, episode: { season: { showId: show.id } } },
      select: { episodeId: true },
    }),
  ]);

  res.json({
    show,
    inLibrary: Boolean(libraryEntry),
    libraryStatus: libraryEntry?.status ?? null,
    watchedEpisodeIds: watched.map((w) => w.episodeId),
  });
});
