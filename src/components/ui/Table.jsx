export default function Table({
  columns = [],
  data = [],
  className = '',
  emptyMessage = 'No data available',
  onRowClick,
}) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`
                  px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider
                  bg-slate-50 dark:bg-slate-800/80 first:rounded-tl-lg last:rounded-tr-lg
                  ${col.align === 'center' ? 'text-center' : ''}
                  ${col.align === 'right' ? 'text-right' : ''}
                  ${col.width ? `w-[${col.width}]` : ''}
                  ${col.className || ''}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`
                  transition-colors duration-100
                  hover:bg-slate-50 dark:hover:bg-slate-800/50
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onRowClick?.(row, rowIdx)}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`
                      px-4 py-3 text-slate-700 dark:text-slate-300
                      ${col.align === 'center' ? 'text-center' : ''}
                      ${col.align === 'right' ? 'text-right' : ''}
                      ${col.className || ''}
                    `}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
