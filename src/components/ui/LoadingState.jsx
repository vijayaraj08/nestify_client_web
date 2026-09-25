import { Loader2 } from 'lucide-react';

export default function LoadingState({
  text = 'Loading...',
  size = 'md',
  className = '',
  fullPage = false,
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`animate-spin text-primary-600 ${sizes[size]}`} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        {content}
      </div>
    );
  }

  return <div className="py-16">{content}</div>;
}
