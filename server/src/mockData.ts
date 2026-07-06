import { NormalizedShow } from "./services/tmdb";

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function makeEpisodes(
  count: number,
  startDate: string,
  stepDays: number,
  tmdbIdBase: number
) {
  return Array.from({ length: count }, (_, i) => ({
    tmdbId: tmdbIdBase + i,
    episodeNumber: i + 1,
    name: `Episode ${i + 1}`,
    overview: "The story continues.",
    airDate: addDays(startDate, i * stepDays),
    stillPath: null,
    runtime: 45,
  }));
}

// Bundled fallback catalog used when TMDB_API_KEY is not configured, so the
// app is fully usable out of the box. Some episodes are anchored around
// 2026-07 (today) so the "upcoming" calendar has something to show.
export const MOCK_SHOWS: NormalizedShow[] = [
  {
    tmdbId: 1001,
    name: "Nightfall Station",
    overview: "A crew aboard a deep-space relay station uncovers a signal that shouldn't exist.",
    posterPath: null,
    backdropPath: null,
    firstAirDate: "2023-03-10",
    status: "Returning Series",
    numberOfSeasons: 2,
    numberOfEpisodes: 16,
    seasons: [
      {
        seasonNumber: 1,
        name: "Season 1",
        episodeCount: 8,
        posterPath: null,
        episodes: makeEpisodes(8, "2023-03-10", 7, 100101),
      },
      {
        seasonNumber: 2,
        name: "Season 2",
        episodeCount: 8,
        posterPath: null,
        episodes: makeEpisodes(8, "2026-07-02", 7, 100201),
      },
    ],
  },
  {
    tmdbId: 1002,
    name: "The Corner Table",
    overview: "Four friends navigate careers, breakups, and bad decisions in one Brooklyn diner.",
    posterPath: null,
    backdropPath: null,
    firstAirDate: "2021-09-01",
    status: "Returning Series",
    numberOfSeasons: 3,
    numberOfEpisodes: 30,
    seasons: [
      {
        seasonNumber: 1,
        name: "Season 1",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2021-09-01", 7, 101001),
      },
      {
        seasonNumber: 2,
        name: "Season 2",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2022-09-01", 7, 102001),
      },
      {
        seasonNumber: 3,
        name: "Season 3",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2026-06-24", 6, 103001),
      },
    ],
  },
  {
    tmdbId: 1003,
    name: "Redline",
    overview: "An undercover detective infiltrates a street racing syndicate.",
    posterPath: null,
    backdropPath: null,
    firstAirDate: "2024-01-12",
    status: "Ended",
    numberOfSeasons: 1,
    numberOfEpisodes: 6,
    seasons: [
      {
        seasonNumber: 1,
        name: "Season 1",
        episodeCount: 6,
        posterPath: null,
        episodes: makeEpisodes(6, "2024-01-12", 7, 100301),
      },
    ],
  },
  {
    tmdbId: 1004,
    name: "Paper Kingdoms",
    overview: "A fantasy epic about three rival dynasties fighting over a failing kingdom.",
    posterPath: null,
    backdropPath: null,
    firstAirDate: "2022-10-05",
    status: "Returning Series",
    numberOfSeasons: 2,
    numberOfEpisodes: 20,
    seasons: [
      {
        seasonNumber: 1,
        name: "Season 1",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2022-10-05", 7, 104001),
      },
      {
        seasonNumber: 2,
        name: "Season 2",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2026-07-09", 9, 104101),
      },
    ],
  },
  {
    tmdbId: 1005,
    name: "Static Noise",
    overview: "A true-crime podcaster starts receiving calls about a case she never covered.",
    posterPath: null,
    backdropPath: null,
    firstAirDate: "2025-05-20",
    status: "Returning Series",
    numberOfSeasons: 1,
    numberOfEpisodes: 8,
    seasons: [
      {
        seasonNumber: 1,
        name: "Season 1",
        episodeCount: 8,
        posterPath: null,
        episodes: makeEpisodes(8, "2026-06-15", 4, 100501),
      },
    ],
  },
  {
    tmdbId: 1006,
    name: "Kitchen Rush",
    overview: "A rotating cast of chefs battles it out weekly for a spot in the finals.",
    posterPath: null,
    backdropPath: null,
    firstAirDate: "2020-06-01",
    status: "Returning Series",
    numberOfSeasons: 4,
    numberOfEpisodes: 40,
    seasons: [
      {
        seasonNumber: 1,
        name: "Season 1",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2020-06-01", 7, 106001),
      },
      {
        seasonNumber: 2,
        name: "Season 2",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2021-06-01", 7, 106101),
      },
      {
        seasonNumber: 3,
        name: "Season 3",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2022-06-01", 7, 106201),
      },
      {
        seasonNumber: 4,
        name: "Season 4",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2026-07-01", 7, 106301),
      },
    ],
  },
  {
    tmdbId: 1007,
    name: "Glass Houses",
    overview: "Three siblings inherit their late father's architecture firm — and his secrets.",
    posterPath: null,
    backdropPath: null,
    firstAirDate: "2023-11-14",
    status: "Ended",
    numberOfSeasons: 1,
    numberOfEpisodes: 10,
    seasons: [
      {
        seasonNumber: 1,
        name: "Season 1",
        episodeCount: 10,
        posterPath: null,
        episodes: makeEpisodes(10, "2023-11-14", 3, 100701),
      },
    ],
  },
  {
    tmdbId: 1008,
    name: "The Long Shift",
    overview: "A night-shift ER team holds it together through chaos, one twelve-hour shift at a time.",
    posterPath: null,
    backdropPath: null,
    firstAirDate: "2021-02-08",
    status: "Returning Series",
    numberOfSeasons: 3,
    numberOfEpisodes: 36,
    seasons: [
      {
        seasonNumber: 1,
        name: "Season 1",
        episodeCount: 12,
        posterPath: null,
        episodes: makeEpisodes(12, "2021-02-08", 7, 100801),
      },
      {
        seasonNumber: 2,
        name: "Season 2",
        episodeCount: 12,
        posterPath: null,
        episodes: makeEpisodes(12, "2022-02-08", 7, 100901),
      },
      {
        seasonNumber: 3,
        name: "Season 3",
        episodeCount: 12,
        posterPath: null,
        episodes: makeEpisodes(12, "2026-06-29", 7, 101101),
      },
    ],
  },
];
