import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

export const episodesRouter = Router();

episodesRouter.post("/:episodeId/watch", requireAuth, async (req: AuthedRequest, res) => {
  const episode = await prisma.episode.findUnique({ where: { id: req.params.episodeId } });
  if (!episode) return res.status(404).json({ error: "Episode not found" });

  const watched = await prisma.watchedEpisode.upsert({
    where: { userId_episodeId: { userId: req.userId!, episodeId: episode.id } },
    update: {},
    create: { userId: req.userId!, episodeId: episode.id },
  });
  res.status(201).json({ watched });
});

episodesRouter.delete("/:episodeId/watch", requireAuth, async (req: AuthedRequest, res) => {
  await prisma.watchedEpisode
    .delete({ where: { userId_episodeId: { userId: req.userId!, episodeId: req.params.episodeId } } })
    .catch(() => null);
  res.status(204).send();
});
