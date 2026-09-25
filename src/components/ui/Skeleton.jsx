export default function Skeleton({
  width,
  height = '1rem',
  rounded = 'md',
  className = '',
}) {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        bg-slate-200 animate-pulse-soft
        ${roundedMap[rounded]}
        ${className}
      `}
      style={{
        width: width || '100%',
        height,
      }}
      aria-hidden="true"
    />
  );
}

/** Pre-built skeleton patterns */
Skeleton.Text = function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.75rem"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};

Skeleton.Card = function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-5 border border-slate-200 rounded-lg space-y-4 ${className}`}>
      <Skeleton height="1rem" width="40%" />
      <Skeleton.Text lines={2} />
      <div className="flex gap-3">
        <Skeleton height="2rem" width="5rem" rounded="md" />
        <Skeleton height="2rem" width="5rem" rounded="md" />
      </div>
    </div>
  );
};

Skeleton.Avatar = function SkeletonAvatar({ size = '2.5rem' }) {
  return <Skeleton width={size} height={size} rounded="full" />;
};

Skeleton.TableRow = function SkeletonTableRow({ cols = 4, className = '' }) {
  return (
    <div className={`flex items-center gap-4 py-3 ${className}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height="0.75rem" width={i === 0 ? '20%' : '15%'} />
      ))}
    </div>
  );
};
