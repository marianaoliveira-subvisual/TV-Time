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
import { Poster, paletteGradient } from "../components/Poster";
import { ChevronLeftIcon, CheckIcon } from "../components/icons";

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
  const [heroFrom, heroTo] = paletteGradient(show.name);

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
      <div className="-mx-4 relative mb-10">
        <div
          className="h-28 rounded-b-[2rem]"
          style={{ background: `linear-gradient(135deg, ${heroFrom}, ${heroTo})` }}
        />
        <Link
          to="/"
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-4 h-4 text-stone-700" />
        </Link>
        <div className="absolute left-4 -bottom-10">
          <Poster
            name={show.name}
            posterPath={show.posterPath}
            className="w-24 aspect-[2/3] rounded-xl shrink-0 shadow-lg ring-4 ring-cream"
          />
        </div>
      </div>

      <h1 className="font-display text-xl font-bold text-stone-800 leading-tight">{show.name}</h1>
      <p className="text-xs text-stone-500 mb-2 mt-0.5">
        {show.firstAirDate?.slice(0, 4)} · {show.status} · {show.numberOfSeasons} season
        {show.numberOfSeasons !== 1 ? "s" : ""}
      </p>
      <p className="text-xs text-stone-600 mb-3 line-clamp-4">{show.overview}</p>
      <button
        onClick={toggleLibrary}
        disabled={busy}
        className={`rounded-full px-4 py-1.5 text-sm font-display font-bold transition disabled:opacity-50 ${
          inLibrary
            ? "bg-white border border-stone-900/10 text-stone-600 shadow-sm"
            : "bg-sage hover:bg-sage-dark text-white shadow-md shadow-sage/30"
        }`}
      >
        {inLibrary ? "In Library ✓" : "+ Add to Library"}
      </button>

      {inLibrary && (
        <div className="mt-4">
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

      <div className="flex gap-2 mt-4 mb-4 overflow-x-auto">
        {show.seasons.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveSeason(i)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-display font-bold transition ${
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
          const [stillFrom, stillTo] = paletteGradient(`${show.name}-${ep.id}`);
          return (
            <div
              key={ep.id}
              className="flex items-center gap-3 bg-white border border-stone-900/10 rounded-xl px-3 py-2.5 shadow-sm"
            >
              <div
                className="shrink-0 w-14 h-9 rounded-lg flex items-center justify-center text-white text-xs font-display font-bold"
                style={{ background: `linear-gradient(135deg, ${stillFrom}, ${stillTo})` }}
              >
                E{ep.episodeNumber}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate text-stone-800">{ep.name}</p>
                <p className="text-xs text-stone-400">{ep.airDate || "TBA"}</p>
              </div>
              <button
                onClick={() => toggleWatched(ep.id)}
                aria-label={watched ? "Mark unwatched" : "Mark watched"}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition ${
                  watched
                    ? "bg-rose text-white shadow-sm"
                    : "bg-stone-100 text-stone-300 hover:text-stone-400"
                }`}
              >
                <CheckIcon className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
