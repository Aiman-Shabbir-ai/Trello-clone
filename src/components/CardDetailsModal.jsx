import { useEffect, useState } from 'react'
import { Calendar, CheckCircle2, MessageSquare, X } from 'lucide-react'
import { Badge } from './Badge'
import { AvatarGroup } from './AvatarGroup'
import './CardDetailsModal.css'

export function CardDetailsModal({ card, onClose }) {
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    if (!card) {
      return
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [card, onClose])

  useEffect(() => {
    setShowComments(false)
  }, [card?.id])

  if (!card) {
    return null
  }

  const commentsList = Array.isArray(card.commentList) ? card.commentList : []

  return (
    <div className="card-modal-overlay" onClick={onClose} role="presentation">
      <section
        className="card-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${card.title} details`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="card-modal-header">
          <div>
            <h2>{card.title}</h2>
            <p>{card.columnTitle}</p>
          </div>
          <button type="button" aria-label="Close card details" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="card-modal-tags">
          {card.tags.map((tag) => (
            <Badge key={tag.label} label={tag.label} tone={tag.tone} />
          ))}
        </div>

        <p className="card-modal-description">{card.description}</p>

        <div className="card-modal-meta">
          <span>
            <Calendar size={14} />
            {card.date}
          </span>
          <button
            type="button"
            className="meta-comments-btn"
            onClick={() => setShowComments((prev) => !prev)}
            aria-expanded={showComments}
          >
            <MessageSquare size={14} />
            {card.comments} comments
          </button>
          {card.progress && (
            <span className={card.done ? 'done' : ''}>
              {card.done && <CheckCircle2 size={14} />}
              {card.progress}
            </span>
          )}
        </div>

        <div className="card-modal-assignees">
          <h3>Assignees</h3>
          <AvatarGroup users={card.assignees} />
        </div>

        {showComments && (
          <div className="card-modal-comments">
            <h3>Comments ({card.comments})</h3>
            {commentsList.length > 0 ? (
              <ul>
                {commentsList.map((comment) => (
                  <li key={comment.id}>
                    <p>{comment.text}</p>
                    {comment.author && <span>{comment.author}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-comments">
                {card.comments > 0
                  ? 'Comments exist for this card but details are not available yet.'
                  : 'No comments yet.'}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
