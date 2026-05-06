import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  Copy,
  Paperclip,
  Trash2,
  UserRoundPlus,
  ArrowRight,
  X,
  Plus,
  Send,
} from 'lucide-react'
import { Badge } from './Badge'
import { formatDueShort, isDueOverdue } from '../utils/dueDate'
import { getChecklistStats } from '../utils/checklist'
import './CardDetailsModal.css'

function newKey(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function CardDetailsModal({ selection, columns, onClose, onUpdateCard, onArchiveCard, onMoveCard }) {
  const [moveTargetId, setMoveTargetId] = useState('')
  const [commentDraft, setCommentDraft] = useState('')
  const [checklistDraft, setChecklistDraft] = useState('')
  const [copyHint, setCopyHint] = useState('')

  useEffect(() => {
    if (!selection) {
      return
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selection, onClose])

  const card = selection?.card
  const columnId = selection?.columnId

  const checklistItems = useMemo(() => (Array.isArray(card?.checklist) ? card.checklist : []), [card])
  const commentsList = useMemo(() => (Array.isArray(card?.commentList) ? card.commentList : []), [card])
  const { completed: completedCount, total: totalCount } = getChecklistStats(checklistItems)
  const completionRatio =
    totalCount === 0 ? 0 : Math.min(100, Math.round((completedCount / totalCount) * 100))

  const overdue = card ? isDueOverdue(card.dueDate) : false
  const dueLabel = card ? formatDueShort(card.dueDate) : ''

  if (!selection || !card || !columnId) {
    return null
  }

  const handleTitleChange = (event) => {
    onUpdateCard(columnId, card.id, { title: event.target.value })
  }

  const handleDescriptionChange = (event) => {
    onUpdateCard(columnId, card.id, { description: event.target.value })
  }

  const handleDueChange = (event) => {
    const value = event.target.value
    onUpdateCard(columnId, card.id, { dueDate: value || null })
  }

  const toggleChecklistItem = (itemId) => {
    const next = checklistItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    )
    onUpdateCard(columnId, card.id, { checklist: next })
  }

  const addChecklistItem = (event) => {
    event.preventDefault()
    const text = checklistDraft.trim()
    if (!text) {
      return
    }
    const next = [...checklistItems, { id: newKey('chk'), text, completed: false }]
    onUpdateCard(columnId, card.id, { checklist: next })
    setChecklistDraft('')
  }

  const removeChecklistItem = (itemId) => {
    const next = checklistItems.filter((item) => item.id !== itemId)
    onUpdateCard(columnId, card.id, { checklist: next })
  }

  const addComment = (event) => {
    event.preventDefault()
    const text = commentDraft.trim()
    if (!text) {
      return
    }
    const next = [
      ...commentsList,
      { id: newKey('cmt'), author: 'You', text },
    ]
    onUpdateCard(columnId, card.id, { commentList: next })
    setCommentDraft('')
  }

  const handleCopyCard = async () => {
    const payload = JSON.stringify(
      {
        title: card.title,
        description: card.description,
        tags: card.tags,
        dueDate: card.dueDate,
        checklist: card.checklist,
      },
      null,
      2
    )
    try {
      await navigator.clipboard.writeText(payload)
      setCopyHint('Copied card JSON')
    } catch {
      setCopyHint('Copy blocked in this browser')
    }
    window.setTimeout(() => setCopyHint(''), 2200)
  }

  const handleMove = (targetColumnId = moveTargetId) => {
    if (!targetColumnId || targetColumnId === columnId) {
      return
    }
    onMoveCard(card.id, columnId, targetColumnId)
    setMoveTargetId('')
    onClose()
  }

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
          <div className="card-modal-header-main">
            <div className="card-modal-tags">
              {(card.tags ?? []).map((tag) => (
                <Badge key={tag.label} label={tag.label} tone={tag.tone} />
              ))}
            </div>
            <input
              className="card-modal-title-input"
              value={card.title}
              onChange={handleTitleChange}
              aria-label="Card title"
            />
          </div>
          <button type="button" aria-label="Close card details" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="card-modal-layout">
          <section className="card-modal-main-panel">
            <div className="detail-block">
              <h3>Description</h3>
              <textarea
                className="card-modal-description-input"
                rows={4}
                value={card.description ?? ''}
                onChange={handleDescriptionChange}
                placeholder="Add a more detailed description..."
              />
            </div>

            <div className="detail-block">
              <div className="checklist-header">
                <h3>Checklist</h3>
                <span>
                  {completedCount}/{totalCount} completed
                </span>
              </div>
              {totalCount > 0 && (
                <div className="progress-box">
                  <div className="progress-head">
                    <span>Progress</span>
                    <strong>{completionRatio}%</strong>
                  </div>
                  <div className="progress-track" role="progressbar" aria-valuenow={completionRatio}>
                    <span style={{ width: `${completionRatio}%` }} />
                  </div>
                </div>
              )}
              <ul className="checklist-items">
                {checklistItems.map((item) => (
                  <li key={item.id}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      aria-label={`Toggle ${item.text}`}
                    />
                    <span className={item.completed ? 'checked' : ''}>{item.text}</span>
                    <button
                      type="button"
                      className="checklist-remove"
                      aria-label={`Remove ${item.text}`}
                      onClick={() => removeChecklistItem(item.id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <form className="checklist-add" onSubmit={addChecklistItem}>
                <input
                  value={checklistDraft}
                  onChange={(event) => setChecklistDraft(event.target.value)}
                  placeholder="Add an item and press Enter"
                  aria-label="New checklist item"
                />
                <button type="submit" className="checklist-add-btn" aria-label="Add checklist item">
                  <Plus size={16} />
                </button>
              </form>
            </div>

            <div className="detail-block">
              <h3>Attachments</h3>
              <p className="muted-hint">File uploads can be wired to storage next; links and previews stay on the roadmap.</p>
              <div className="attachment-list">
                <div className="attachment-item">
                  <span className="attachment-icon red">
                    <Paperclip size={14} />
                  </span>
                  <div>
                    <strong>Design_Mockups.pdf</strong>
                    <small>Placeholder</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-block">
              <h3>Comments</h3>
              <ul className="comment-list">
                {commentsList.map((comment) => (
                  <li key={comment.id} className="comment-row">
                    <div className="comment-meta">
                      <strong>{comment.author}</strong>
                    </div>
                    <p>{comment.text}</p>
                  </li>
                ))}
              </ul>
              <form className="comment-form" onSubmit={addComment}>
                <textarea
                  rows={2}
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder="Write a comment..."
                />
                <button type="submit" className="comment-submit">
                  <Send size={14} />
                  Comment
                </button>
              </form>
            </div>
          </section>

          <aside className="card-modal-side-panel">
            <div className="side-block">
              <h3>Actions</h3>
              <div className="move-row">
                <label className="sr-only" htmlFor="move-list-select">
                  Move to list
                </label>
                <select
                  id="move-list-select"
                  value={moveTargetId}
                  onChange={(event) => {
                    const targetId = event.target.value
                    setMoveTargetId(targetId)
                    handleMove(targetId)
                  }}
                >
                  <option value="">Move to…</option>
                  {columns
                    .filter((column) => column.id !== columnId)
                    .map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                </select>
                <button type="button" className="side-action" onClick={handleMove} disabled={!moveTargetId}>
                  <ArrowRight size={15} />
                  Move
                </button>
              </div>
              <button type="button" className="side-action" onClick={handleCopyCard}>
                <Copy size={15} />
                Copy Card
              </button>
              {copyHint && <p className="copy-hint">{copyHint}</p>}
              <button
                type="button"
                className="side-action danger"
                onClick={() => {
                  onArchiveCard(columnId, card.id)
                  onClose()
                }}
              >
                <Trash2 size={15} />
                Archive Card
              </button>
            </div>

            <div className="side-block">
              <h3>Members</h3>
              {(card.assignees ?? []).map((member) => (
                <div className="member-row" key={member.id}>
                  <img src={member.avatar} alt={member.name} />
                  <span>{member.name.split(' ')[0]}</span>
                </div>
              ))}
              <button type="button" className="link-btn" disabled>
                <UserRoundPlus size={14} />
                Add Member
              </button>
            </div>

            <div className="side-block">
              <h3>Labels</h3>
              <div className="card-modal-tags">
                {(card.tags ?? []).map((tag) => (
                  <Badge key={`side-${tag.label}`} label={tag.label} tone={tag.tone} />
                ))}
              </div>
            </div>

            <div className="side-block">
              <h3>Due Date</h3>
              <label className="due-input-row">
                <Calendar size={14} />
                <input type="date" value={card.dueDate ?? ''} onChange={handleDueChange} />
              </label>
              {dueLabel && (
                <div className={`due-box ${overdue ? 'overdue' : ''}`}>
                  <p>
                    <Calendar size={14} />
                    {dueLabel}
                  </p>
                  {overdue && <small>Overdue</small>}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
