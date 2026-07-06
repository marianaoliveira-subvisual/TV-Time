import { prisma } from "../prisma";
import { getShowDetails } from "./tmdb";

// Fetches a show (with seasons + episodes) from our local cache, populating
// it from TMDB/mock data on first request. Library entries and watched
// episodes reference these local rows so tracking works the same regardless
// of data source.
export async function getOrCacheShow(tmdbId: number) {
  const existing = await prisma.show.findUnique({
    where: { tmdbId },
    include: { seasons: { include: { episodes: true }, orderBy: { seasonNumber: "asc" } } },
  });
  if (existing) return existing;

  const details = await getShowDetails(tmdbId);
  if (!details) return null;

  const show = await prisma.show.create({
    data: {
      tmdbId: details.tmdbId,
      name: details.name,
      overview: details.overview,
      posterPath: details.posterPath,
      backdropPath: details.backdropPath,
      firstAirDate: details.firstAirDate,
      status: details.status,
      numberOfSeasons: details.numberOfSeasons,
      numberOfEpisodes: details.numberOfEpisodes,
      seasons: {
        create: details.seasons.map((season) => ({
          seasonNumber: season.seasonNumber,
          name: season.name,
          episodeCount: season.episodeCount,
          posterPath: season.posterPath,
          episodes: {
            create: season.episodes.map((ep) => ({
              tmdbId: ep.tmdbId,
              seasonNumber: season.seasonNumber,
              episodeNumber: ep.episodeNumber,
              name: ep.name,
              overview: ep.overview,
              airDate: ep.airDate,
              stillPath: ep.stillPath,
              runtime: ep.runtime,
            })),
          },
        })),
      },
    },
    include: { seasons: { include: { episodes: true }, orderBy: { seasonNumber: "asc" } } },
  });

  return show;
}
