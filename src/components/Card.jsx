import { Badge } from './Badge'
import { AvatarGroup } from './AvatarGroup'
import { AlertCircle, Calendar, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react'
import { formatDueShort, isDueOverdue } from '../utils/dueDate'
import { getChecklistProgressLabel } from '../utils/checklist'
import './Card.css'

export function Card({ card, columnId, dragDisabled, onOpen, onDelete }) {
  const handleDragStart = (event) => {
    if (dragDisabled) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData('cardId', card.id)
    event.dataTransfer.setData('sourceColumnId', columnId)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  const dueLabel = formatDueShort(card.dueDate)
  const overdue = isDueOverdue(card.dueDate)
  const progressLabel = getChecklistProgressLabel(card.checklist)
  const commentCount = Array.isArray(card.commentList) ? card.commentList.length : 0

  return (
    <article
      className={`task-card${dragDisabled ? ' task-card--no-drag' : ''}`}
      data-card-id={card.id}
      tabIndex={0}
      aria-label={`${card.title} task card`}
      draggable={!dragDisabled}
      onDragStart={handleDragStart}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="drag-affordance" aria-hidden="true" />
      <div className="tag-row">
        {(card.tags ?? []).map((tag) => (
          <Badge key={tag.label} label={tag.label} tone={tag.tone} />
        ))}
      </div>

      <h3>{card.title}</h3>
      <p>{card.description}</p>

      <footer className="card-footer">
        <div className="card-meta">
          {dueLabel && (
            <span className={`meta-item ${overdue ? 'meta-alert' : ''}`}>
              {overdue && <AlertCircle size={12} />}
              <Calendar size={12} />
              {dueLabel}
            </span>
          )}
          {commentCount > 0 && (
            <span className="meta-item">
              <MessageSquare size={12} />
              {commentCount}
            </span>
          )}
          {progressLabel && (
            <span className={`meta-item progress-pill ${card.done ? 'progress-done' : ''}`}>
              {card.done && <CheckCircle2 size={12} />}
              {progressLabel}
            </span>
          )}
        </div>
        <div className="card-footer-right">
          <AvatarGroup users={card.assignees ?? []} />
          <button
            type="button"
            className="card-delete-btn"
            aria-label={`Delete ${card.title}`}
            onClick={(event) => {
              event.stopPropagation()
              if (window.confirm(`Delete card "${card.title}"?`)) {
                onDelete()
              }
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </footer>
    </article>
  )
}
