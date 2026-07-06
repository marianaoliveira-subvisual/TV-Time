import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addToLibrary,
  getShow,
  markEpisodeUnwatched,
  markEpisodeWatched,
  removeFromLibrary,
} from "../api/shows";
import type { ShowDetailResponse } from "../api/types";
import { Poster } from "../components/Poster";

export function ShowDetailPage() {
  const { tmdbId } = useParams<{ tmdbId: string }>();
  const [data, setData] = useState<ShowDetailResponse | null>(null);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [activeSeason, setActiveSeason] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!tmdbId) return;
    getShow(Number(tmdbId)).then((res) => {
      setData(res);
      setWatchedIds(new Set(res.watchedEpisodeIds));
    });
  }, [tmdbId]);

  if (!data) return <p className="text-slate-500 text-sm">Loading…</p>;

  const { show, inLibrary } = data;
  const season = show.seasons[activeSeason];

  async function toggleLibrary() {
    setBusy(true);
    try {
      if (data!.inLibrary) {
        await removeFromLibrary(show.id);
        setData({ ...data!, inLibrary: false, libraryStatus: null });
      } else {
        await addToLibrary(show.tmdbId);
        setData({ ...data!, inLibrary: true, libraryStatus: "watching" });
      }
    } finally {
      setBusy(false);
    }
  }

  async function toggleWatched(episodeId: string) {
    const next = new Set(watchedIds);
    if (next.has(episodeId)) {
      next.delete(episodeId);
      setWatchedIds(next);
      await markEpisodeUnwatched(episodeId);
    } else {
      next.add(episodeId);
      setWatchedIds(next);
      await markEpisodeWatched(episodeId);
    }
  }

  const totalEpisodes = show.seasons.reduce((n, s) => n + s.episodes.length, 0);
  const watchedCount = show.seasons.reduce(
    (n, s) => n + s.episodes.filter((e) => watchedIds.has(e.id)).length,
    0
  );

  return (
    <div>
      <Link to="/" className="text-sm text-slate-400 hover:text-white">
        ← Back
      </Link>

      <div className="flex gap-5 mt-3 mb-6">
        <Poster
          name={show.name}
          posterPath={show.posterPath}
          className="w-32 sm:w-40 aspect-[2/3] rounded-lg shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">{show.name}</h1>
          <p className="text-sm text-slate-500 mb-2">
            {show.firstAirDate?.slice(0, 4)} · {show.status} · {show.numberOfSeasons} season
            {show.numberOfSeasons !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-slate-300 mb-4 line-clamp-4">{show.overview}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLibrary}
              disabled={busy}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                inLibrary
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-indigo-500 hover:bg-indigo-400 text-white"
              }`}
            >
              {inLibrary ? "In Library ✓" : "+ Add to Library"}
            </button>
            {inLibrary && (
              <span className="text-sm text-slate-400">
                {watchedCount}/{totalEpisodes} episodes watched
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {show.seasons.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveSeason(i)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              i === activeSeason
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/60"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {season?.episodes.map((ep) => {
          const watched = watchedIds.has(ep.id);
          return (
            <div
              key={ep.id}
              className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
            >
              <button
                onClick={() => toggleWatched(ep.id)}
                aria-label={watched ? "Mark unwatched" : "Mark watched"}
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition ${
                  watched
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-slate-600 text-transparent hover:border-slate-400"
                }`}
              >
                ✓
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {ep.episodeNumber}. {ep.name}
                </p>
                <p className="text-xs text-slate-500">{ep.airDate || "TBA"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
