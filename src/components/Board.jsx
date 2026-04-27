import { Column } from './Column'
import './Board.css'

export function Board({ columns, onMoveCard, onCardOpen, onAddCard }) {
  return (
    <main className="board-content">
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
