import { Badge } from './Badge'
import { AvatarGroup } from './AvatarGroup'
import { AlertCircle, Calendar, CheckCircle2, MessageSquare } from 'lucide-react'
import './Card.css'

export function Card({ card, columnId, onOpen }) {
  const handleDragStart = (event) => {
    event.dataTransfer.setData('cardId', card.id)
    event.dataTransfer.setData('sourceColumnId', columnId)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <article
      className="task-card"
      tabIndex={0}
      aria-label={`${card.title} task card`}
      draggable
      onDragStart={handleDragStart}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="drag-affordance" aria-hidden="true" />
      <div className="tag-row">
        {card.tags.map((tag) => (
          <Badge key={tag.label} label={tag.label} tone={tag.tone} />
        ))}
      </div>

      <h3>{card.title}</h3>
      <p>{card.description}</p>

      <footer className="card-footer">
        <div className="card-meta">
          <span className={`meta-item ${card.alert ? 'meta-alert' : ''}`}>
            {card.alert && <AlertCircle size={12} />}
            <Calendar size={12} />
            {card.date}
          </span>
          <span className="meta-item">
            <MessageSquare size={12} />
            {card.comments}
          </span>
          {card.progress && (
            <span className={`meta-item progress-pill ${card.done ? 'progress-done' : ''}`}>
              {card.done && <CheckCircle2 size={12} />}
              {card.progress}
            </span>
          )}
        </div>
        <AvatarGroup users={card.assignees} />
      </footer>
    </article>
  )
}
