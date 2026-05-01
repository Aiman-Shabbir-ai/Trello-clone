import { Column } from './Column'
import './Board.css'

export function Board({ columns, searchQuery, onMoveCard, onCardOpen, onAddCard }) {
  const hasAnyVisibleCards = columns.some((column) => column.cards.length > 0)

  return (
    <main className="board-content">
      {searchQuery.trim() && !hasAnyVisibleCards && (
        <div className="search-empty-state">
          No matching cards for "<strong>{searchQuery.trim()}</strong>". Try task title, label, or member
          name.
        </div>
      )}
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          onMoveCard={onMoveCard}
          onCardOpen={onCardOpen}
          onAddCard={onAddCard}
        />
      ))}
    </main>
  )
}
