import './Header.css'
import {
  Bell,
  LayoutPanelTop,
  Palette,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

export function Header() {
  return (
    <header className="board-header">
      <div className="header-left">
        <div className="app-brand">
          <span className="brand-logo">K</span>
          <h1 className="app-title">Kanban App</h1>
        </div>
        <div className="search-box">
          <Search size={14} className="icon" />
          <input type="text" placeholder="Search tasks, members..." />
        </div>
        <button className="btn btn-ghost">
          <SlidersHorizontal size={13} />
          Filter ▾
        </button>
      </div>

      <div className="header-right">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={14} />
          <span className="notif-dot" aria-hidden="true" />
        </button>
        <button className="btn btn-outline">
          <Palette size={13} className="customize-icon" />
          Customize
        </button>
        <button className="icon-btn" aria-label="Sidebar">
          <LayoutPanelTop size={14} />
        </button>
      </div>
    </header>
  )
}
