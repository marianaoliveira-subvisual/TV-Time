function hashHue(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % 360;
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
        className={`object-cover bg-slate-800 ${className}`}
        loading="lazy"
      />
    );
  }

  const hue = hashHue(name);
  return (
    <div
      className={`flex items-center justify-center text-center px-2 font-semibold text-white ${className}`}
      style={{
        background: `linear-gradient(160deg, hsl(${hue} 70% 32%), hsl(${(hue + 40) % 360} 70% 18%))`,
      }}
    >
      <span className="line-clamp-4 text-sm">{name}</span>
    </div>
  );
}
