import { useEffect, useState } from 'react'
import {
  Calendar,
  CheckSquare,
  Copy,
  Paperclip,
  Trash2,
  UserRoundPlus,
  ArrowRight,
  X,
} from 'lucide-react'
import { Badge } from './Badge'
import './CardDetailsModal.css'

export function CardDetailsModal({ card, onClose }) {
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

  if (!card) {
    return null
  }

  const commentsList = Array.isArray(card.commentList) ? card.commentList : []
  const [completedRaw = '0', totalRaw = '1'] = (card.progress || '0/1').split('/')
  const completedCount = Number.parseInt(completedRaw, 10) || 0
  const totalCount = Number.parseInt(totalRaw, 10) || 1
  const completionRatio = Math.min(100, Math.round((completedCount / totalCount) * 100))

  const checklistItems = Array.from({ length: totalCount }, (_, index) => ({
    id: `${card.id}-item-${index + 1}`,
    label: commentsList[index]?.text?.slice(0, 24) || `Task item ${index + 1}`,
    completed: index < completedCount,
  }))

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
              {card.tags.map((tag) => (
                <Badge key={tag.label} label={tag.label} tone={tag.tone} />
              ))}
            </div>
            <h2>{card.title}</h2>
          </div>
          <button type="button" aria-label="Close card details" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="card-modal-layout">
          <section className="card-modal-main-panel">
            <div className="detail-block">
              <h3>Description</h3>
              <p className="card-modal-description">{card.description}</p>
            </div>

            <div className="detail-block">
              <div className="checklist-header">
                <h3>Checklist</h3>
                <span>
                  {completedCount}/{totalCount} completed
                </span>
              </div>
              <div className="progress-box">
                <div className="progress-head">
                  <span>Progress</span>
                  <strong>{completionRatio}%</strong>
                </div>
                <div className="progress-track" role="progressbar" aria-valuenow={completionRatio}>
                  <span style={{ width: `${completionRatio}%` }} />
                </div>
              </div>
              <ul className="checklist-items">
                {checklistItems.map((item) => (
                  <li key={item.id}>
                    <input type="checkbox" checked={item.completed} readOnly />
                    <span className={item.completed ? 'checked' : ''}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-block">
              <h3>Attachments</h3>
              <div className="attachment-list">
                <div className="attachment-item">
                  <span className="attachment-icon red">
                    <Paperclip size={14} />
                  </span>
                  <div>
                    <strong>Design_Mockups.pdf</strong>
                    <small>2.4 MB</small>
                  </div>
                </div>
                <div className="attachment-item">
                  <span className="attachment-icon blue">
                    <Paperclip size={14} />
                  </span>
                  <div>
                    <strong>Requirements.docx</strong>
                    <small>1.8 MB</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="card-modal-side-panel">
            <div className="side-block">
              <h3>Actions</h3>
              <button type="button" className="side-action">
                <ArrowRight size={15} />
                Move Card
              </button>
              <button type="button" className="side-action">
                <Copy size={15} />
                Copy Card
              </button>
              <button type="button" className="side-action danger">
                <Trash2 size={15} />
                Archive Card
              </button>
            </div>

            <div className="side-block">
              <h3>Members</h3>
              {card.assignees.map((member) => (
                <div className="member-row" key={member.id}>
                  <img src={member.avatar} alt={member.name} />
                  <span>{member.name.split(' ')[0]}</span>
                </div>
              ))}
              <button type="button" className="link-btn">
                <UserRoundPlus size={14} />
                Add Member
              </button>
            </div>

            <div className="side-block">
              <h3>Labels</h3>
              <div className="card-modal-tags">
                {card.tags.map((tag) => (
                  <Badge key={`side-${tag.label}`} label={tag.label} tone={tag.tone} />
                ))}
              </div>
            </div>

            <div className="side-block">
              <h3>Due Date</h3>
              <div className={`due-box ${card.alert ? 'overdue' : ''}`}>
                <p>
                  <Calendar size={14} />
                  {card.date}
                </p>
                {card.alert && <small>Overdue</small>}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
