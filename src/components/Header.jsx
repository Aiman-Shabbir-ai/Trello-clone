import { useEffect, useRef, useState } from 'react'
import './Header.css'
import {
  Bell,
  LayoutPanelTop,
  Palette,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react'

const FILTER_LABELS = ['DESIGN', 'DEVELOPMENT', 'URGENT', 'RESEARCH']

export function Header({
  boardTitle,
  onRenameBoard,
  searchQuery,
  onSearchChange,
  filterLabels,
  onFilterLabelsChange,
  onGoHome,
}) {
  const [editingTitle, setEditingTitle] = useState(boardTitle)
  const [titleOpen, setTitleOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    if (!filterOpen) {
      return
    }

    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [filterOpen])

  const toggleFilterLabel = (label) => {
    onFilterLabelsChange(
      filterLabels.includes(label)
        ? filterLabels.filter((item) => item !== label)
        : [...filterLabels, label]
    )
  }

  const commitTitle = () => {
    onRenameBoard(editingTitle)
    setTitleOpen(false)
  }

  return (
    <header className="board-header">
      <div className="header-left">
        <div className="app-brand">
          <span className="brand-logo">T</span>
          {!titleOpen ? (
            <button
              type="button"
              className="board-title-btn"
              onClick={() => {
                setEditingTitle(boardTitle)
                setTitleOpen(true)
              }}
            >
              <h1 className="app-title">{boardTitle}</h1>
            </button>
          ) : (
            <input
              className="board-title-input"
              value={editingTitle}
              onChange={(event) => setEditingTitle(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitTitle()
                }
                if (event.key === 'Escape') {
                  setEditingTitle(boardTitle)
                  setTitleOpen(false)
                }
              }}
              aria-label="Board title"
              autoFocus
            />
          )}
        </div>
        <div className="search-box">
          <Search size={14} className="icon" />
          <input
            type="text"
            placeholder="Search cards, labels, members..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search cards and members"
          />
        </div>
        <div className="filter-wrap" ref={filterRef}>
          <button
            type="button"
            className={`btn btn-ghost ${filterLabels.length ? 'btn-ghost-active' : ''}`}
            onClick={() => setFilterOpen((open) => !open)}
            aria-expanded={filterOpen}
            aria-haspopup="true"
          >
            <SlidersHorizontal size={13} />
            Filter
            {filterLabels.length > 0 && <span className="filter-count">{filterLabels.length}</span>}
            <ChevronDown size={13} className={filterOpen ? 'chev-open' : ''} />
          </button>
          {filterOpen && (
            <div className="filter-panel" role="menu">
              <p className="filter-panel-title">Filter by label</p>
              {FILTER_LABELS.map((label) => (
                <label key={label} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filterLabels.includes(label)}
                    onChange={() => toggleFilterLabel(label)}
                  />
                  <span>{label}</span>
                </label>
              ))}
              {filterLabels.length > 0 && (
                <button type="button" className="filter-clear" onClick={() => onFilterLabelsChange([])}>
                  Clear labels
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        <button type="button" className="btn btn-ghost" onClick={onGoHome}>
          Home
        </button>
        <button type="button" className="icon-btn" aria-label="Notifications">
          <Bell size={14} />
          <span className="notif-dot" aria-hidden="true" />
        </button>
        <button type="button" className="btn btn-outline" disabled>
          <Palette size={13} className="customize-icon" />
          Customize
        </button>
        <button type="button" className="icon-btn" aria-label="Sidebar">
          <LayoutPanelTop size={14} />
        </button>
      </div>
    </header>
  )
}
