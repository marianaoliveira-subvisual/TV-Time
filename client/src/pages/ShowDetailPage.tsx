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
import { ChevronLeftIcon } from "../components/icons";

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

  if (!data) return <p className="text-stone-400 text-sm">Loading…</p>;

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
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800">
        <ChevronLeftIcon className="w-4 h-4" />
        Back
      </Link>

      <div className="flex gap-4 mt-3 mb-6">
        <Poster
          name={show.name}
          posterPath={show.posterPath}
          className="w-28 aspect-[2/3] rounded-xl shrink-0 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 leading-tight">{show.name}</h1>
          <p className="text-xs text-stone-500 mb-2">
            {show.firstAirDate?.slice(0, 4)} · {show.status} · {show.numberOfSeasons} season
            {show.numberOfSeasons !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-stone-600 mb-3 line-clamp-4">{show.overview}</p>
          <button
            onClick={toggleLibrary}
            disabled={busy}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition disabled:opacity-50 ${
              inLibrary
                ? "bg-white border border-stone-900/10 text-stone-600"
                : "bg-sage hover:bg-sage-dark text-white"
            }`}
          >
            {inLibrary ? "In Library ✓" : "+ Add to Library"}
          </button>
        </div>
      </div>

      {inLibrary && (
        <div className="mb-4">
          <div className="w-full h-1.5 rounded-full bg-stone-900/10 overflow-hidden">
            <div
              className="h-full bg-peach rounded-full transition-all"
              style={{ width: `${totalEpisodes ? (watchedCount / totalEpisodes) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {watchedCount}/{totalEpisodes} episodes watched
          </p>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {show.seasons.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveSeason(i)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              i === activeSeason
                ? "bg-sage text-white"
                : "bg-white text-stone-500 border border-stone-900/10"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="space-y-2 pb-2">
        {season?.episodes.map((ep) => {
          const watched = watchedIds.has(ep.id);
          return (
            <div
              key={ep.id}
              className="flex items-center gap-3 bg-white border border-stone-900/10 rounded-xl px-4 py-3 shadow-sm"
            >
              <button
                onClick={() => toggleWatched(ep.id)}
                aria-label={watched ? "Mark unwatched" : "Mark watched"}
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition ${
                  watched
                    ? "bg-rose border-rose text-white"
                    : "border-stone-300 text-transparent hover:border-stone-400"
                }`}
              >
                ✓
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-stone-800">
                  {ep.episodeNumber}. {ep.name}
                </p>
                <p className="text-xs text-stone-400">{ep.airDate || "TBA"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
