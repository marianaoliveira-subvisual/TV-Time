export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface ShowSummary {
  tmdbId: number;
  name: string;
  overview: string;
  posterPath: string | null;
  firstAirDate: string | null;
}

export interface Episode {
  id: string;
  tmdbId: number | null;
  seasonId: string;
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  overview: string | null;
  airDate: string | null;
  stillPath: string | null;
  runtime: number | null;
}

export interface Season {
  id: string;
  showId: string;
  seasonNumber: number;
  name: string;
  episodeCount: number;
  posterPath: string | null;
  episodes: Episode[];
}

export interface Show {
  id: string;
  tmdbId: number;
  name: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  firstAirDate: string | null;
  status: string | null;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: Season[];
}

export interface ShowDetailResponse {
  show: Show;
  inLibrary: boolean;
  libraryStatus: string | null;
  watchedEpisodeIds: string[];
}

export type LibraryStatus = "watching" | "completed" | "planned" | "dropped";

export interface LibraryItem {
  id: string;
  status: LibraryStatus;
  addedAt: string;
  show: {
    id: string;
    tmdbId: number;
    name: string;
    posterPath: string | null;
    firstAirDate: string | null;
    status: string | null;
  };
  progress: { watched: number; total: number };
}

export interface UpcomingEpisode {
  episodeId: string;
  episodeName: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate: string | null;
  showTmdbId: number;
  showName: string;
  showPosterPath: string | null;
}

export interface Stats {
  episodesWatched: number;
  hoursWatched: number;
  showsInLibrary: number;
  showsCompleted: number;
}
