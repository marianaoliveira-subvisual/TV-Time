const PALETTE_PAIRS = [
  ["#788e77", "#5f7360"],
  ["#f5ab7e", "#e29796"],
  ["#f7c883", "#f5ab7e"],
  ["#c5c099", "#788e77"],
  ["#e29796", "#f0d0cf"],
  ["#f7c883", "#c5c099"],
];

function paletteIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % PALETTE_PAIRS.length;
}

export function Poster({
  name,
  posterPath,
  className = "",
}: {
  name: string;
  posterPath: string | null;
  className?: string;
}) {
  if (posterPath) {
    return (
      <img
        src={posterPath}
        alt={name}
        className={`object-cover bg-stone-200 ${className}`}
        loading="lazy"
      />
    );
  }

  const [from, to] = PALETTE_PAIRS[paletteIndex(name)];
  return (
    <div
      className={`flex items-center justify-center text-center px-2 font-semibold text-white ${className}`}
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      <span className="line-clamp-4 text-sm">{name}</span>
    </div>
  );
}
