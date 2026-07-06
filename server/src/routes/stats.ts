import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

export const statsRouter = Router();

statsRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const watchedEpisodes = await prisma.watchedEpisode.findMany({
    where: { userId: req.userId! },
    include: { episode: true },
  });

  const episodesWatched = watchedEpisodes.length;
  const minutesWatched = watchedEpisodes.reduce((sum, w) => sum + (w.episode.runtime ?? 45), 0);
  const hoursWatched = Math.round((minutesWatched / 60) * 10) / 10;

  const [showsInLibrary, showsCompleted] = await Promise.all([
    prisma.libraryEntry.count({ where: { userId: req.userId! } }),
    prisma.libraryEntry.count({ where: { userId: req.userId!, status: "completed" } }),
  ]);

  res.json({
    episodesWatched,
    hoursWatched,
    showsInLibrary,
    showsCompleted,
  });
});

statsRouter.get("/calendar", requireAuth, async (req: AuthedRequest, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const entries = await prisma.libraryEntry.findMany({
    where: { userId: req.userId! },
    include: {
      show: {
        include: {
          seasons: {
            include: {
              episodes: { where: { airDate: { gte: today } }, orderBy: { airDate: "asc" } },
            },
          },
        },
      },
    },
  });

  const upcoming = entries
    .flatMap((entry) =>
      entry.show.seasons.flatMap((season) =>
        season.episodes.map((ep) => ({
          episodeId: ep.id,
          episodeName: ep.name,
          seasonNumber: ep.seasonNumber,
          episodeNumber: ep.episodeNumber,
          airDate: ep.airDate,
          showTmdbId: entry.show.tmdbId,
          showName: entry.show.name,
          showPosterPath: entry.show.posterPath,
        }))
      )
    )
    .sort((a, b) => (a.airDate! < b.airDate! ? -1 : 1));

  res.json({ upcoming });
});
