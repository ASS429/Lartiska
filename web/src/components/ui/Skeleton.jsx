/**
 * Skeleton primitif — bloc avec shimmer cinematic.
 * Pour usage direct ou comme brique pour des skeletons composés (ProjectCardSkeleton, etc.).
 */
export function Skeleton({ className = '', as: Tag = 'div' }) {
  return <Tag className={`skeleton-block ${className}`} aria-hidden="true" />;
}

/**
 * Skeleton de carte projet (Portfolio).
 * Reproduit le ratio 4:5 + zone meta en bas.
 */
export function ProjectCardSkeleton() {
  return (
    <div className="project-card pointer-events-none" aria-hidden="true">
      <div className="skeleton-block absolute inset-0" />
      <div className="project-meta">
        <Skeleton className="h-3 w-24 mb-3 rounded-full" />
        <Skeleton className="h-5 w-3/4 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Skeleton d'une carte service.
 */
export function ServiceCardSkeleton() {
  return (
    <article className="surface-card p-8 md:p-9 flex flex-col gap-5" aria-hidden="true">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-7 w-3/4 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-5/6 rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
      <div className="border-t border-line pt-5 mt-1 flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-16 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-md" />
        </div>
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>
    </article>
  );
}

/**
 * Skeleton générique pour les lignes de tableau / liste admin.
 */
export function RowSkeleton({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-line" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={`h-4 rounded-md ${i === 0 ? 'w-32' : 'flex-1'}`} />
      ))}
    </div>
  );
}
