export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  border = true,
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        bg-white dark:bg-slate-900 rounded-xl
        ${border ? 'border border-slate-200/80 dark:border-slate-800' : ''}
        ${hover ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer' : ''}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-slate-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`}>
      {children}
    </p>
  );
}

function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
