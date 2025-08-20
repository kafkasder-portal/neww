export function exportToCsv(filename: string, rows: unknown[], headers?: string[]) {
  const processRow = (row: unknown) => {
    if (Array.isArray(row)) return row
    if (typeof row === 'object' && row !== null) return Object.values(row as Record<string, unknown>)
    return [String(row)]
  }

  const csvRows = rows.map((r) => processRow(r).map(escapeCsv).join(','))
  if (headers && headers.length) csvRows.unshift(headers.map(escapeCsv).join(','))
  const csv = csvRows.join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.click()
  URL.revokeObjectURL(url)
}

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return ''
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"'
  }
  return text
}


