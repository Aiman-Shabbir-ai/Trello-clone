import { useEffect, useMemo, useState } from 'react'
import { Tag, Users, Calendar, X } from 'lucide-react'
import './CreateCardModal.css'

const LABEL_OPTIONS = [
  { label: 'DESIGN', tone: 'purple' },
  { label: 'DEVELOPMENT', tone: 'blue' },
  { label: 'URGENT', tone: 'red' },
  { label: 'RESEARCH', tone: 'green' },
]

const MEMBER_OPTIONS = [
  { id: 'emma', name: 'Emma', avatar: 'https://i.pravatar.cc/80?img=32' },
  { id: 'james', name: 'James', avatar: 'https://i.pravatar.cc/80?img=12' },
  { id: 'sophia', name: 'Sophia', avatar: 'https://i.pravatar.cc/80?img=47' },
  { id: 'liam', name: 'Liam', avatar: 'https://i.pravatar.cc/80?img=22' },
]

export function CreateCardModal({ isOpen, columnTitle, onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [selectedLabels, setSelectedLabels] = useState(['DESIGN'])
  const [selectedMembers, setSelectedMembers] = useState([])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const isSubmitDisabled = useMemo(() => !title.trim(), [title])

  if (!isOpen) {
    return null
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDueDate('')
    setSelectedLabels(['DESIGN'])
    setSelectedMembers([])
  }

  const toggleLabel = (label) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    )
  }

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((item) => item !== memberId) : [...prev, memberId]
    )
  }

  const handleCreate = (event) => {
    event.preventDefault()
    if (!title.trim()) {
      return
    }

    onSubmit({
      title,
      description,
      dueDate: dueDate || null,
      labels: LABEL_OPTIONS.filter((item) => selectedLabels.includes(item.label)),
      members: MEMBER_OPTIONS.filter((item) => selectedMembers.includes(item.id)),
    })
    resetForm()
  }

  return (
    <div className="create-card-overlay" role="presentation" onClick={onClose}>
      <section
        className="create-card-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Create new card"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="create-card-header">
          <div>
            <h2>Create New Card</h2>
            <p>{columnTitle}</p>
          </div>
          <button type="button" aria-label="Close create card modal" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleCreate} className="create-card-body">
          <label>
            Card Title
            <input
              type="text"
              placeholder="Enter card title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </label>

          <label>
            Description
            <textarea
              rows={4}
              placeholder="Add a more detailed description..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="create-card-section-title">
            <Tag size={16} />
            <span>Labels</span>
          </div>
          <div className="label-pills">
            {LABEL_OPTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`label-pill badge-${item.tone} ${selectedLabels.includes(item.label) ? 'active' : ''}`}
                onClick={() => toggleLabel(item.label)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="create-card-section-title">
            <Users size={16} />
            <span>Assign Members</span>
          </div>
          <div className="member-grid">
            {MEMBER_OPTIONS.map((member) => (
              <button
                key={member.id}
                type="button"
                className={`member-option ${selectedMembers.includes(member.id) ? 'active' : ''}`}
                onClick={() => toggleMember(member.id)}
              >
                <img src={member.avatar} alt={member.name} />
                <span>{member.name}</span>
              </button>
            ))}
          </div>

          <div className="create-card-section-title">
            <Calendar size={16} />
            <span>Due Date</span>
          </div>
          <input
            type="date"
            className="create-card-date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-label="Due date"
          />

          <footer className="create-card-footer">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => {
                resetForm()
                onClose()
              }}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={isSubmitDisabled}>
              Save Card
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
