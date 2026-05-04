export function moveCardToIndex(columns, cardId, fromColumnId, toColumnId, rawInsertIndex) {
  const next = columns.map((column) => ({ ...column, cards: [...column.cards] }))
  const fromCol = next.find((column) => column.id === fromColumnId)
  const toCol = next.find((column) => column.id === toColumnId)

  if (!fromCol || !toCol) {
    return columns
  }

  const sourceIndex = fromCol.cards.findIndex((card) => card.id === cardId)
  if (sourceIndex === -1) {
    return columns
  }

  const [moving] = fromCol.cards.splice(sourceIndex, 1)

  let insertAt = rawInsertIndex
  if (fromColumnId === toColumnId && insertAt > sourceIndex) {
    insertAt -= 1
  }

  insertAt = Math.max(0, Math.min(insertAt, toCol.cards.length))
  toCol.cards.splice(insertAt, 0, moving)

  return next
}
