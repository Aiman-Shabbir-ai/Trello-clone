/** @param {string | null | undefined} isoDate YYYY-MM-DD */
export function formatDueShort(isoDate) {
  if (!isoDate) {
    return ''
  }
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) {
    return isoDate
  }
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Start of local day for comparison */
function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** @param {string | null | undefined} isoDate YYYY-MM-DD */
export function isDueOverdue(isoDate) {
  if (!isoDate) {
    return false
  }
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) {
    return false
  }
  const due = startOfLocalDay(new Date(y, m - 1, d))
  const today = startOfLocalDay(new Date())
  return due < today
}
