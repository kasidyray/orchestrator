export interface ParamRow {
  name: string
  type: string
  required?: boolean
  description: string
}

/** Request/response parameter table for docs pages. */
export function ParamTable({ rows }: { rows: ParamRow[] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            <th className="px-3 py-2 font-medium text-muted-foreground">
              Parameter
            </th>
            <th className="px-3 py-2 font-medium text-muted-foreground">
              Type
            </th>
            <th className="px-3 py-2 font-medium text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="px-3 py-2 align-top">
                <code className="font-mono text-xs text-foreground">
                  {row.name}
                </code>
                {row.required ? (
                  <span className="ml-1.5 text-xs text-destructive">
                    required
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-2 align-top font-mono text-xs text-muted-foreground">
                {row.type}
              </td>
              <td className="px-3 py-2 align-top text-muted-foreground">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
