import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { getOrCacheShow } from "../services/showCache";

export const libraryRouter = Router();

libraryRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const entries = await prisma.libraryEntry.findMany({
    where: { userId: req.userId! },
    include: { show: { include: { seasons: { include: { episodes: true } } } } },
    orderBy: { addedAt: "desc" },
  });

  const watched = await prisma.watchedEpisode.findMany({
    where: { userId: req.userId! },
    select: { episodeId: true },
  });
  const watchedIds = new Set(watched.map((w) => w.episodeId));

  const library = entries.map((entry) => {
    const allEpisodes = entry.show.seasons.flatMap((s) => s.episodes);
    const totalEpisodes = allEpisodes.length;
    const watchedEpisodes = allEpisodes.filter((e) => watchedIds.has(e.id)).length;
    return {
      id: entry.id,
      status: entry.status,
      addedAt: entry.addedAt,
      show: {
        id: entry.show.id,
        tmdbId: entry.show.tmdbId,
        name: entry.show.name,
        posterPath: entry.show.posterPath,
        firstAirDate: entry.show.firstAirDate,
        status: entry.show.status,
      },
      progress: { watched: watchedEpisodes, total: totalEpisodes },
    };
  });

  res.json({ library });
});

const addLibrarySchema = z.object({ tmdbId: z.number().int() });

libraryRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = addLibrarySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const show = await getOrCacheShow(parsed.data.tmdbId);
  if (!show) return res.status(404).json({ error: "Show not found" });

  const entry = await prisma.libraryEntry.upsert({
    where: { userId_showId: { userId: req.userId!, showId: show.id } },
    update: {},
    create: { userId: req.userId!, showId: show.id, status: "watching" },
  });

  res.status(201).json({ libraryEntry: entry });
});

const updateStatusSchema = z.object({
  status: z.enum(["watching", "completed", "planned", "dropped"]),
});

libraryRouter.patch("/:showId", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  try {
    const entry = await prisma.libraryEntry.update({
      where: { userId_showId: { userId: req.userId!, showId: req.params.showId } },
      data: { status: parsed.data.status },
    });
    res.json({ libraryEntry: entry });
  } catch {
    res.status(404).json({ error: "Library entry not found" });
  }
});

libraryRouter.delete("/:showId", requireAuth, async (req: AuthedRequest, res) => {
  await prisma.libraryEntry
    .delete({ where: { userId_showId: { userId: req.userId!, showId: req.params.showId } } })
    .catch(() => null);
  res.status(204).send();
});
