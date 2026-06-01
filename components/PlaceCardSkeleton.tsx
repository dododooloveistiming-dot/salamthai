export default function PlaceCardSkeleton() {
  return (
    <div className="card-editorial flex h-full flex-col gap-3 overflow-hidden">
      <div className="aspect-video w-full animate-pulse bg-ink-100 dark:bg-ink-800" />
      <div className="px-4 pb-4">
        <div className="h-3 w-24 animate-pulse rounded bg-gold-100 dark:bg-gold-950/40" />
        <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <PlaceCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
