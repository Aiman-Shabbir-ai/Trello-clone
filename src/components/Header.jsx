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
          <span className="brand-logo" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1045 3.89543 21 5 21H19C20.1045 21 21 20.1045 21 19V5C21 3.89543 20.1045 3 19 3H5Z"
                fill="currentColor"
              />
              <path
                d="M10 7C10.5523 7 11 7.44772 11 8V16C11 16.5523 10.5523 17 10 17H7C6.44772 17 6 16.5523 6 16V8C6 7.44772 6.44772 7 7 7H10Z"
                fill="#ffffff"
              />
              <path
                d="M17 7C17.5523 7 18 7.44772 18 8V13C18 13.5523 17.5523 14 17 14H14C13.4477 14 13 13.5523 13 13V8C13 7.44772 13.4477 7 14 7H17Z"
                fill="#ffffff"
              />
            </svg>
          </span>
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
