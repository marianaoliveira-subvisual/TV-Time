import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { addToLibrary, searchShows } from "../api/shows";
import type { ShowSummary } from "../api/types";
import { Poster } from "../components/Poster";
import { SearchIcon, PlusIcon, CheckIcon } from "../components/icons";

export function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShowSummary[]>([]);
  const [usingMockData, setUsingMockData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      searchShows(query)
        .then((res) => {
          setResults(res.results);
          setUsingMockData(res.usingMockData);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  async function quickAdd(tmdbId: number, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAdded((prev) => new Set(prev).add(tmdbId));
    await addToLibrary(tmdbId);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1 text-stone-800">Discover</h1>
      <p className="text-stone-500 text-sm mb-4">Search for shows to add to your library.</p>

      {usingMockData && (
        <div className="mb-4 text-xs text-stone-700 bg-butter/40 border border-butter rounded-lg px-3 py-2">
          Showing sample data — set <code className="font-semibold">TMDB_API_KEY</code> in{" "}
          <code className="font-semibold">server/.env</code> to pull real shows from TMDB.
        </div>
      )}

      <div className="relative mb-5">
        <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          placeholder="Search shows…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full bg-white border border-stone-900/10 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : results.length === 0 ? (
        <p className="text-stone-400 text-sm">No shows found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {results.map((show) => {
            const isAdded = added.has(show.tmdbId);
            return (
              <Link
                key={show.tmdbId}
                to={`/shows/${show.tmdbId}`}
                className="group block rounded-xl overflow-hidden bg-white border border-stone-900/10 hover:border-sage transition shadow-sm"
              >
                <div className="relative">
                  <Poster name={show.name} posterPath={show.posterPath} className="w-full aspect-[2/3]" />
                  <button
                    onClick={(e) => quickAdd(show.tmdbId, e)}
                    aria-label={isAdded ? "Added to library" : "Quick add to library"}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition ${
                      isAdded ? "bg-rose text-white" : "bg-white/90 text-sage-dark hover:bg-white"
                    }`}
                  >
                    {isAdded ? <CheckIcon className="w-3.5 h-3.5" /> : <PlusIcon className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold truncate text-stone-800 group-hover:text-sage-dark">
                    {show.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {show.firstAirDate ? show.firstAirDate.slice(0, 4) : "TBA"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
