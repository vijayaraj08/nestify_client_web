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
          <tr className="border-b border-slate-200">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`
                  px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider
                  bg-slate-50 first:rounded-tl-lg last:rounded-tr-lg
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
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-slate-400"
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
                  hover:bg-slate-50
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onRowClick?.(row, rowIdx)}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`
                      px-4 py-3 text-slate-700
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
