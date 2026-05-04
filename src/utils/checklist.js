/** @param {{ id: string, text: string, completed: boolean }[] | undefined} checklist */
export function getChecklistStats(checklist) {
  const items = Array.isArray(checklist) ? checklist : []
  const total = items.length
  const completed = items.filter((item) => item.completed).length
  return { completed, total }
}

/** @param {{ id: string, text: string, completed: boolean }[] | undefined} checklist */
export function getChecklistProgressLabel(checklist) {
  const { completed, total } = getChecklistStats(checklist)
  if (total === 0) {
    return null
  }
  return `${completed}/${total}`
}
