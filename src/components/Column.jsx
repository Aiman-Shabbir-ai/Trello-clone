import { useState } from 'react'
import { Card } from './Card'
import { Ellipsis, Plus } from 'lucide-react'
import './Column.css'

export function Column({ column, onMoveCard, onCardOpen, onAddCard }) {
  const completedCards = column.cards.filter((card) => card.done).length
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const cardId = event.dataTransfer.getData('cardId')
    const sourceColumnId = event.dataTransfer.getData('sourceColumnId')
    onMoveCard(cardId, sourceColumnId, column.id)
  }

  const openComposer = () => {
    setIsAddingCard(true)
  }

  const closeComposer = () => {
    setIsAddingCard(false)
    setTitle('')
    setDescription('')
  }

  const handleAddCard = (event) => {
    event.preventDefault()
    if (!title.trim()) {
      return
    }
    onAddCard(column.id, { title, description })
    closeComposer()
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
          <button type="button" aria-label="Add card" onClick={openComposer}>
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

      {isAddingCard ? (
        <form className="card-composer" onSubmit={handleAddCard}>
          <input
            type="text"
            placeholder="Card title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
            required
          />
          <textarea
            rows={3}
            placeholder="Description (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="card-composer-actions">
            <button type="submit" className="composer-submit-btn">
              Add card
            </button>
            <button type="button" className="composer-cancel-btn" onClick={closeComposer}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="add-card-btn" onClick={openComposer}>
          + Add a card
        </button>
      )}
    </section>
  )
}
