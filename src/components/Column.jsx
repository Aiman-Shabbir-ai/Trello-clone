import { Card } from './Card'
import { Ellipsis, Plus } from 'lucide-react'
import './Column.css'

export function Column({ column, onMoveCard, onCardOpen, onAddCard }) {
  const completedCards = column.cards.filter((card) => card.done).length

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const cardId = event.dataTransfer.getData('cardId')
    const sourceColumnId = event.dataTransfer.getData('sourceColumnId')
    onMoveCard(cardId, sourceColumnId, column.id)
  }

  return (
    <section className="column">
      <div className="column-header">
        <div className="column-title">
          <h2>{column.title}</h2>
          <span className="count">
            {completedCards}/{column.cards.length}
          </span>
        </div>
        <div className="column-actions">
          <button type="button" aria-label="Add card" onClick={() => onAddCard(column.id)}>
            <Plus size={14} />
          </button>
          <button aria-label="More options">
            <Ellipsis size={14} />
          </button>
        </div>
      </div>

      <div className="column-cards" onDragOver={handleDragOver} onDrop={handleDrop}>
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            onOpen={() => onCardOpen(card, column.title)}
          />
        ))}
      </div>

      <button type="button" className="add-card-btn" onClick={() => onAddCard(column.id)}>
        + Add a card
      </button>
    </section>
  )
}
