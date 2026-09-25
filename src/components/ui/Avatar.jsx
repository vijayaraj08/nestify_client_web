import { User } from 'lucide-react';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg',
};

export default function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
}) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null;

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`
          rounded-full object-cover shrink-0
          ${sizes[size]}
          ${className}
        `}
      />
    );
  }

  if (initials) {
    return (
      <div
        className={`
          rounded-full shrink-0 inline-flex items-center justify-center
          bg-primary-100 text-primary-700 font-medium
          ${sizes[size]}
          ${className}
        `}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-full shrink-0 inline-flex items-center justify-center
        bg-slate-100 text-slate-500
        ${sizes[size]}
        ${className}
      `}
    >
      <User size={size === 'xs' ? 12 : size === 'sm' ? 16 : 20} />
    </div>
  );
}
