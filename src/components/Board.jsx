import { useState } from 'react'
import { Column } from './Column'
import './Board.css'

export function Board({
  columns,
  totalCards,
  visibleCards,
  isBoardFiltered,
  searchQuery,
  filterLabels,
  onMoveCard,
  onCardOpen,
  onAddCard,
  onAddColumn,
  onDeleteColumn,
  onDeleteCard,
}) {
  const hasAnyVisibleCards = visibleCards > 0
  const [listDraft, setListDraft] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)

  const handleAddList = (event) => {
    event.preventDefault()
    onAddColumn(listDraft)
    setListDraft('')
    setComposerOpen(false)
  }

  return (
    <main className="board-content">
      {totalCards > 0 && !hasAnyVisibleCards && (
        <div className="search-empty-state">
          No cards match your{' '}
          {[searchQuery.trim() && 'search', filterLabels.length > 0 && 'labels'].filter(Boolean).join(' and ') || 'filters'}
          . Try another keyword or clear filters.
        </div>
      )}
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          dragDisabled={isBoardFiltered}
          onMoveCard={onMoveCard}
          onCardOpen={(card) => onCardOpen(card, column.id, column.title)}
          onAddCard={onAddCard}
          onDeleteColumn={onDeleteColumn}
          onDeleteCard={onDeleteCard}
        />
      ))}

      <section className="add-list-column">
        {!composerOpen ? (
          <button type="button" className="add-list-trigger" onClick={() => setComposerOpen(true)}>
            + Add another list
          </button>
        ) : (
          <form className="add-list-form" onSubmit={handleAddList}>
            <input
              autoFocus
              value={listDraft}
              onChange={(event) => setListDraft(event.target.value)}
              placeholder="Enter list title..."
              aria-label="New list title"
            />
            <div className="add-list-actions">
              <button type="submit" className="add-list-submit">
                Add list
              </button>
              <button type="button" className="add-list-cancel" onClick={() => setComposerOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}
