import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BadgeHelp,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Globe2,
  HelpCircle,
  Home,
  Info,
  LayoutGrid,
  LayoutTemplate,
  Lock,
  Pencil,
  Settings,
  Plus,
  Search,
  SquareKanban,
  UserRound,
  Users,
  X,
  Sparkles,
  Moon,
  MoreVertical,
} from 'lucide-react'
import './HomePage.css'
import { AdvancedSearch } from './AdvancedSearch'
import { AppStoreModal } from './AppStoreModal'
import { AppSwitcherSidebar } from './AppSwitcherSidebar'
import { WorkspaceMembers } from './WorkspaceMembers'
import { WorkspaceSettings } from './WorkspaceSettings'

const RECENT_BOARDS = [
  { id: 'b1', title: 'ParentsPlus', workspace: 'Trello Workspace', color: 'sunset' },
  { id: 'b2', title: 'Trello Clone', workspace: 'Trello Workspace', color: 'violet' },
  {
    id: 'b3',
    title: 'AI-Based Fake News Detection',
    workspace: 'Trello Workspace',
    color: 'teal',
  },
  { id: 'b4', title: 'My Trello board', workspace: 'Trello Workspace', color: 'pink' },
]

const BACKGROUND_IMAGE_PRESETS = [
  { id: 'img-night', className: 'bg-thumb-night', boardTone: 'violet' },
  { id: 'img-nebula', className: 'bg-thumb-nebula', boardTone: 'teal' },
  { id: 'img-mountains', className: 'bg-thumb-mountains', boardTone: 'sunset' },
  { id: 'img-forest', className: 'bg-thumb-forest', boardTone: 'pink' },
]

const BACKGROUND_COLOR_PRESETS = [
  { id: 'blue', className: 'blue', boardTone: 'teal' },
  { id: 'indigo', className: 'indigo', boardTone: 'violet' },
  { id: 'violet', className: 'violet', boardTone: 'violet' },
  { id: 'magenta', className: 'magenta', boardTone: 'pink' },
]

const VISIBILITY_OPTIONS = [
  {
    id: 'private',
    label: 'Private',
    description:
      'Only board members can see this board. Workspace admins can close the board or remove members.',
    icon: Lock,
  },
  {
    id: 'workspace',
    label: 'Workspace',
    description:
      'All members of the Trello Workspace can see and edit this board.',
    icon: Users,
  },
  {
    id: 'public',
    label: 'Public',
    description: 'Anyone on the internet can see this board. Only board members can edit.',
    icon: Globe2,
  },
]

const TEMPLATE_CATEGORY_LIST = [
  'Popular',
  'Small business',
  'Design',
  'Education',
  'Engineering-IT',
  'Marketing',
  'Human Resources',
  'Operations',
  'Sales CRM',
]

const TEMPLATE_CARDS = [
  {
    id: 't1',
    title: 'My Tasks | Trello',
    tone: 'template-orange',
    category: 'Popular',
    backgroundColor: 'sunset',
    lists: [
      {
        title: 'To do',
        initialCards: [
          { title: 'Plan my week', description: 'Review tasks and priorities for this week.' },
          { title: 'Pay utility bills', description: 'Electricity and internet due this Friday.' },
        ],
      },
      {
        title: 'Doing',
        initialCards: [{ title: 'Finish Trello clone', description: 'Template selection + board styling.' }],
      },
      { title: 'Done', initialCards: [{ title: 'Set monthly goals', description: 'Work, fitness, and learning.' }] },
    ],
  },
  {
    id: 't2',
    title: 'New Hire Onboarding',
    tone: 'template-green',
    category: 'Human Resources',
    backgroundColor: 'teal',
    lists: [
      {
        title: 'Before Day 1',
        initialCards: [
          { title: 'Send welcome email', description: 'Share agenda and first-day expectations.' },
          { title: 'Prepare laptop and accounts', description: 'Provision system access and credentials.' },
        ],
      },
      {
        title: 'Week 1',
        initialCards: [{ title: 'Intro meetings', description: 'Schedule with manager and teammates.' }],
      },
      { title: 'Completed', initialCards: [{ title: 'Signed policy docs', description: 'All documents uploaded.' }] },
    ],
  },
  {
    id: 't3',
    title: 'Tier List',
    tone: 'template-blue',
    category: 'Education',
    backgroundColor: 'teal',
    lists: [
      { title: 'S Tier', initialCards: [{ title: 'Algorithms', description: 'Core high-priority concepts.' }] },
      { title: 'A Tier', initialCards: [{ title: 'Databases', description: 'Indexing and transactions.' }] },
      { title: 'B Tier', initialCards: [{ title: 'Networking', description: 'Protocols and reliability.' }] },
    ],
  },
  {
    id: 't4',
    title: 'Innovation Weeks',
    tone: 'template-gold',
    category: 'Marketing',
    backgroundColor: 'sunset',
    lists: [
      { title: 'Ideas', initialCards: [{ title: 'Community challenge', description: 'User-generated content week.' }] },
      { title: 'Experimenting', initialCards: [{ title: 'Landing page A/B test', description: 'Measure signup lift.' }] },
      { title: 'Launched', initialCards: [{ title: 'Referral campaign', description: 'Reward invite-based signups.' }] },
    ],
  },
  {
    id: 't5',
    title: 'Brand Guidelines',
    tone: 'template-teal',
    category: 'Design',
    backgroundColor: 'teal',
    lists: [
      { title: 'Research', initialCards: [{ title: 'Audit competitor branding', description: 'Collect tone and style references.' }] },
      { title: 'Drafting', initialCards: [{ title: 'Color palette v2', description: 'Primary/secondary variants.' }] },
      { title: 'Approved', initialCards: [{ title: 'Logo spacing rules', description: 'Ready for design handoff.' }] },
    ],
  },
  {
    id: 't6',
    title: 'Small Biz CRM',
    tone: 'template-violet',
    category: 'Small business',
    backgroundColor: 'violet',
    lists: [
      { title: 'Leads', initialCards: [{ title: 'Warm outreach list', description: 'Top 20 prospects from website forms.' }] },
      { title: 'Negotiation', initialCards: [{ title: 'Acme proposal', description: 'Waiting for pricing approval.' }] },
      { title: 'Won', initialCards: [{ title: 'Northwind deal', description: 'Contract signed and invoiced.' }] },
    ],
  },
  {
    id: 't7',
    title: 'Sprint Board',
    tone: 'template-slate',
    category: 'Engineering-IT',
    backgroundColor: 'violet',
    lists: [
      { title: 'Backlog', initialCards: [{ title: 'Refactor drag-and-drop', description: 'Improve card drop accuracy.' }] },
      { title: 'In Progress', initialCards: [{ title: 'Add filter chips', description: 'Support multi-label filtering.' }] },
      { title: 'Done', initialCards: [{ title: 'Set up API mocks', description: 'Fallback endpoints ready.' }] },
    ],
  },
  {
    id: 't8',
    title: 'Sales Pipeline',
    tone: 'template-coral',
    category: 'Sales CRM',
    backgroundColor: 'pink',
    lists: [
      { title: 'Prospects', initialCards: [{ title: 'Lead: FitLife', description: 'Inbound from webinar attendee.' }] },
      { title: 'Qualified', initialCards: [{ title: 'Lead: StudioX', description: 'Budget and timeline confirmed.' }] },
      { title: 'Closed', initialCards: [{ title: 'Lead: ByteWorks', description: 'Deal won this quarter.' }] },
    ],
  },
  {
    id: 't9',
    title: 'Ops Checklist',
    tone: 'template-mint',
    category: 'Operations',
    backgroundColor: 'teal',
    lists: [
      { title: 'Pending', initialCards: [{ title: 'Vendor renewal', description: 'Review contract terms and renewal date.' }] },
      { title: 'In Review', initialCards: [{ title: 'Weekly metrics report', description: 'Validate dashboard anomalies.' }] },
      { title: 'Completed', initialCards: [{ title: 'Backup verification', description: 'Restore test passed successfully.' }] },
    ],
  },
]

const TEMPLATE_BOARD_TONES = {
  'template-orange': 'sunset',
  'template-green': 'teal',
  'template-blue': 'teal',
  'template-gold': 'sunset',
  'template-teal': 'teal',
  'template-violet': 'violet',
  'template-slate': 'violet',
  'template-coral': 'pink',
  'template-mint': 'teal',
}

function buildTemplateColumns(template) {
  return (template.lists ?? []).map((list, listIndex) => ({
    id: `${template.id}-list-${listIndex}`,
    title: list.title,
    cards: (list.initialCards ?? []).map((card, cardIndex) => ({
      id: `${template.id}-card-${listIndex}-${cardIndex}`,
      title: card.title,
      description: card.description ?? 'No description added yet.',
      tags: [{ label: 'TEMPLATE', tone: 'blue' }],
      dueDate: null,
      commentList: [],
      assignees: [],
      checklist: [],
      done: false,
    })),
  }))
}

function PopularTemplatesPanel({
  selectedCategory,
  onSelectCategory,
  visibleTemplates,
  isDismissed,
  onDismiss,
  templateIdPrefix,
  onTemplateSelect,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownWrapRef = useRef(null)

  useEffect(() => {
    if (!dropdownOpen) {
      return
    }
    const onDocMouseDown = (event) => {
      if (dropdownWrapRef.current && !dropdownWrapRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [dropdownOpen])

  if (isDismissed) {
    return null
  }

  return (
    <section className="templates-section popular-templates-panel">
      <button
        type="button"
        className="popular-templates-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss templates section"
      >
        <X size={14} />
      </button>
      <div className="popular-templates-title-row">
        <span className="popular-templates-icon" aria-hidden="true">
          <LayoutTemplate size={20} strokeWidth={1.75} />
        </span>
        <h3>Most popular templates</h3>
      </div>
      <p className="popular-templates-intro">
        <span className="popular-templates-intro-text">
          Get going faster with a template from the Trello community or
        </span>
        <span className="template-category-dropdown" ref={dropdownWrapRef}>
          <button
            type="button"
            className="template-category-trigger"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-label="Choose a template category"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {selectedCategory}
            <ChevronDown size={14} aria-hidden />
          </button>
          {dropdownOpen ? (
            <ul className="template-category-menu" role="listbox">
              {TEMPLATE_CATEGORY_LIST.map((category) => (
                <li key={category} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={category === selectedCategory}
                    className={category === selectedCategory ? 'is-active' : ''}
                    onClick={() => {
                      onSelectCategory(category)
                      setDropdownOpen(false)
                    }}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </span>
      </p>
      <div className="template-grid">
        {visibleTemplates.map((template) => (
          <button
            key={`${templateIdPrefix}-template-${template.id}`}
            type="button"
            className="template-card"
            onClick={() => onTemplateSelect(template)}
            aria-label={`Use ${template.title} template`}
          >
            <span className={`template-cover ${template.tone}`} />
            <div className="template-card-body">
              <p>{template.title}</p>
              <span className="template-card-meta">
                {template.lists?.length ?? 0} lists •{' '}
                {(template.lists ?? []).reduce((sum, list) => sum + (list.initialCards?.length ?? 0), 0)} cards
              </span>
              <span className="template-card-cta">
                <Sparkles size={12} />
                Use template
              </span>
            </div>
          </button>
        ))}
      </div>
      <button type="button" className="browse-template-link">
        Browse the full template gallery
      </button>
    </section>
  )
}

export function HomePage({
  currentUser,
  recentBoards = [],
  onOpenBoard,
  onCreateBoard,
  onOpenTemplates,
  onLogout,
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false)
  const [isAppStoreOpen, setIsAppStoreOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTab, setSearchTab] = useState('trello')
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [selectedBackgroundId, setSelectedBackgroundId] = useState('img-night')
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('Popular')
  const [templatesPromoDismissed, setTemplatesPromoDismissed] = useState(false)
  const [visibility, setVisibility] = useState('workspace')
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false)
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true)
  const contentRef = useRef(null)
  const appSwitcherRef = useRef(null)
  const searchWrapRef = useRef(null)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)

  const boardsToShow = useMemo(() => {
    if (recentBoards.length > 0) {
      return recentBoards
    }
    const workspaceName = currentUser?.workspaceName ?? 'Trello Workspace'
    return RECENT_BOARDS.map((board) => ({ ...board, workspace: workspaceName }))
  }, [recentBoards, currentUser])
  const userInitials = useMemo(() => {
    const source = currentUser?.fullName?.trim() || currentUser?.email?.trim() || 'User'
    const parts = source.split(/\s+/).filter(Boolean)
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
  }, [currentUser])
  const selectedBackground = useMemo(
    () =>
      [...BACKGROUND_IMAGE_PRESETS, ...BACKGROUND_COLOR_PRESETS].find(
        (item) => item.id === selectedBackgroundId
      ) ?? BACKGROUND_IMAGE_PRESETS[0],
    [selectedBackgroundId]
  )
  const selectedVisibility = useMemo(
    () => VISIBILITY_OPTIONS.find((item) => item.id === visibility) ?? VISIBILITY_OPTIONS[1],
    [visibility]
  )
  const visibleTemplates = useMemo(() => {
    if (selectedTemplateCategory === 'Popular') {
      return TEMPLATE_CARDS
    }
    return TEMPLATE_CARDS.filter((item) => item.category === selectedTemplateCategory)
  }, [selectedTemplateCategory])
  const SelectedVisibilityIcon = selectedVisibility.icon

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [activeSection])

  useEffect(() => {
    const onDocMouseDown = (event) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
      if (appSwitcherRef.current && !appSwitcherRef.current.contains(event.target)) {
        setIsAppSwitcherOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  const handleCreate = (event) => {
    event.preventDefault()
    const title = newBoardTitle.trim()
    if (!title) {
      return
    }

    onCreateBoard({ title, color: selectedBackground.boardTone })
    setIsCreateModalOpen(false)
    setNewBoardTitle('')
  }

  const handleTemplateSelect = (template) => {
    const boardTone = template.backgroundColor ?? TEMPLATE_BOARD_TONES[template.tone] ?? 'violet'
    onCreateBoard({
      title: template.title,
      color: boardTone,
      columns: buildTemplateColumns(template),
    })
  }

  const handleOpenAdvancedSearch = () => {
    setIsSearchOpen(false)
    setSearchTab('trello')
    setActiveSection('search')
  }

  const handleUpgradeClick = () => {
    window.open('https://trello.com/pricing', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-topbar-left">
          <div className="topbar-popover-wrap app-switcher-wrap" ref={appSwitcherRef}>
            <button
              type="button"
              className="top-icon-btn"
              aria-label="Apps"
              onClick={() => setIsAppSwitcherOpen((open) => !open)}
            >
              <LayoutGrid size={15} />
            </button>
            {isAppSwitcherOpen ? (
              <AppSwitcherSidebar
                onOpenAppStore={() => {
                  setIsAppSwitcherOpen(false)
                  setIsAppStoreOpen(true)
                }}
              />
            ) : null}
          </div>
          <div className="trello-mark" aria-hidden="true">
            T
          </div>
          <div className="home-search" ref={searchWrapRef}>
            <Search size={14} />
            <input
              type="text"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleOpenAdvancedSearch()
                }
              }}
            />
            {isSearchOpen ? (
              <div className="topbar-floating-menu search-results-menu" role="dialog" aria-label="Search">
                <div className="search-popover-tabs">
                  <button
                    type="button"
                    className={searchTab === 'trello' ? 'active' : ''}
                    onClick={() => setSearchTab('trello')}
                  >
                    Trello
                  </button>
                  <button
                    type="button"
                    className={searchTab === 'jira' ? 'active' : ''}
                    onClick={() => setSearchTab('jira')}
                  >
                    Jira
                  </button>
                </div>

                {searchTab === 'trello' ? (
                  <div className="search-popover-trello">
                    <p className="search-popover-heading">RECENT BOARDS</p>
                    <div className="search-popover-board-list">
                      {boardsToShow.slice(0, 6).map((board) => (
                        <button
                          key={`search-board-${board.id}`}
                          type="button"
                          className="search-popover-board-item"
                          onClick={() => onOpenBoard(board)}
                        >
                          <span className={`search-popover-board-thumb ${board.color}`} />
                          <span>
                            <strong>{board.title}</strong>
                            <small>Trello Workspace</small>
                          </span>
                        </button>
                      ))}
                    </div>
                    <button type="button" className="search-advanced-btn" onClick={handleOpenAdvancedSearch}>
                      <Search size={14} />
                      Advanced search
                    </button>
                  </div>
                ) : (
                  <div className="search-popover-jira">
                    <div className="search-popover-jira-empty">
                      <Search size={48} />
                      <p>Start searching to find your work</p>
                    </div>
                    <div className="search-popover-jira-footer">
                      <span>Go to all:</span>
                      <button type="button">Issues</button>
                      <button type="button">Projects</button>
                      <button type="button">Filters</button>
                      <button type="button">People</button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="home-topbar-right">
          <button type="button" className="create-btn" onClick={() => setIsCreateModalOpen(true)}>
            Create
          </button>
          <div className="topbar-popover-wrap" ref={notificationsRef}>
            <button
              type="button"
              className="top-icon-btn"
              aria-label="Notifications"
              onClick={() => setIsNotificationsOpen((current) => !current)}
            >
              <Bell size={15} />
            </button>
            {isNotificationsOpen ? (
              <div className="topbar-floating-menu notifications-menu">
                <div className="notifications-menu-header">
                  <h4>Notifications</h4>
                  <div className="notifications-controls">
                    <label className="unread-toggle-wrap" htmlFor="unread-toggle">
                      <span>Only show unread</span>
                      <span className="unread-toggle active" aria-hidden="true">
                        <Check size={11} />
                      </span>
                    </label>
                    <input id="unread-toggle" type="checkbox" className="sr-only" checked readOnly />
                    <button type="button" className="notifications-more-btn" aria-label="More options">
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </div>
                <div className="notifications-empty-state">
                  <div className="notifications-empty-illustration" aria-hidden="true">
                    <svg viewBox="0 0 180 110" role="img">
                      <circle cx="22" cy="22" r="4" />
                      <circle cx="40" cy="14" r="3" />
                      <circle cx="154" cy="26" r="4" />
                      <circle cx="142" cy="14" r="2.5" />
                      <ellipse cx="90" cy="82" rx="53" ry="13" />
                      <rect x="45" y="58" width="90" height="30" rx="15" />
                      <circle cx="58" cy="64" r="10" />
                      <circle cx="122" cy="64" r="10" />
                      <circle cx="86" cy="66" r="2.5" />
                      <circle cx="95" cy="66" r="2.5" />
                    </svg>
                  </div>
                  <p>No unread notifications</p>
                </div>
              </div>
            ) : null}
          </div>
          <button type="button" className="top-icon-btn" aria-label="Help">
            <HelpCircle size={15} />
          </button>
          <div className="topbar-popover-wrap" ref={profileRef}>
            <button
              type="button"
              className="top-icon-btn profile-trigger-btn"
              aria-label="Account"
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <span className="profile-trigger-avatar">{userInitials}</span>
            </button>
            {isProfileOpen ? (
              <div className="topbar-floating-menu profile-menu">
                <p className="profile-menu-section-label">ACCOUNT</p>
                <div className="profile-summary">
                  <div className="profile-summary-avatar-wrap">
                    <span className="profile-summary-avatar">{userInitials}</span>
                    <button type="button" className="profile-avatar-edit" aria-label="Edit profile picture">
                      <Pencil size={11} />
                    </button>
                  </div>
                  <div className="profile-summary-details">
                    <strong>{currentUser?.fullName ?? 'User'}</strong>
                    <p>
                      {currentUser?.email ?? 'user@example.com'}
                      <Check size={12} />
                    </p>
                  </div>
                </div>
                <div className="profile-menu-block">
                  <button type="button" className="profile-menu-item">
                    Switch accounts
                  </button>
                  <button type="button" className="profile-menu-item">
                    Manage account
                  </button>
                </div>
                <p className="profile-menu-section-label">TRELLO</p>
                <div className="profile-menu-block">
                  <button type="button" className="profile-menu-item">
                    Profile and visibility
                  </button>
                  <button type="button" className="profile-menu-item">
                    Activity
                  </button>
                  <button type="button" className="profile-menu-item">
                    Cards
                  </button>
                  <button type="button" className="profile-menu-item">
                    Settings
                  </button>
                  <button type="button" className="profile-menu-item profile-menu-item-labs">
                    <span className="labs-pill">
                      <Sparkles size={12} />
                      <span>labs</span>
                    </span>
                    <Check size={12} />
                  </button>
                  <button type="button" className="profile-menu-item profile-menu-item-theme">
                    <span>
                      <Moon size={13} />
                      Theme
                    </span>
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="profile-menu-block">
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setIsProfileOpen(false)
                      window.open('https://support.atlassian.com/trello/', '_blank', 'noopener,noreferrer')
                    }}
                  >
                    Help
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setIsProfileOpen(false)
                      setActiveSection('home')
                    }}
                  >
                    Shortcuts
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setIsProfileOpen(false)
                      if (onLogout) {
                        onLogout()
                        return
                      }
                      setActiveSection('home')
                    }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="home-layout">
        <aside className="home-sidebar">
          <button
            type="button"
            className={`sidebar-item ${activeSection === 'boards' ? 'active' : ''}`}
            onClick={() => setActiveSection('boards')}
          >
            <Bookmark size={14} />
            Boards
          </button>
          <button
            type="button"
            className={`sidebar-item ${activeSection === 'templates' ? 'active' : ''}`}
            onClick={() => {
              if (onOpenTemplates) {
                onOpenTemplates()
                return
              }
              setActiveSection('templates')
            }}
          >
            <Compass size={14} />
            Templates
          </button>
          <button
            type="button"
            className={`sidebar-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => setActiveSection('home')}
          >
            <Home size={14} />
            Home
          </button>

          <div className="workspace-block">
            <p>Workspaces</p>
            <button
              type="button"
              className={`workspace-item ${activeSection === 'workspace' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('workspace')
                setIsWorkspaceOpen(true)
              }}
              aria-expanded={isWorkspaceOpen}
            >
              <span className="workspace-avatar">T</span>
              Trello Workspace
              <ChevronDown size={14} />
            </button>
            {isWorkspaceOpen && (
              <div className="workspace-panel">
                <button
                  type="button"
                  className={`workspace-link ${activeSection === 'boards' || activeSection === 'workspace' ? 'active' : ''}`}
                  onClick={() => setActiveSection('boards')}
                >
                  <SquareKanban size={14} />
                  Boards
                </button>
                <button
                  type="button"
                  className={`workspace-link ${activeSection === 'members' ? 'active' : ''}`}
                  onClick={() => setActiveSection('members')}
                >
                  <Users size={14} />
                  Members
                </button>
                <button
                  type="button"
                  className={`workspace-link ${activeSection === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveSection('settings')}
                >
                  <Settings size={14} />
                  Settings
                </button>
                <div className="workspace-upgrade">
                  <strong>Upgrade this Workspace</strong>
                  <p>
                    Get unlimited boards, advanced automation, and more.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="workspace-content" ref={contentRef}>
          {activeSection === 'workspace' || activeSection === 'boards' ? (
            <>
              <section className="workspace-header">
                <div className="workspace-badge">T</div>
                <div>
                  <h2>
                    Trello Workspace <Pencil size={14} />
                  </h2>
                  <p>
                    <Lock size={12} /> Private
                  </p>
                </div>
              </section>

              <PopularTemplatesPanel
                selectedCategory={selectedTemplateCategory}
                onSelectCategory={setSelectedTemplateCategory}
                visibleTemplates={visibleTemplates}
                isDismissed={templatesPromoDismissed}
                onDismiss={() => setTemplatesPromoDismissed(true)}
                templateIdPrefix="workspace"
                onTemplateSelect={handleTemplateSelect}
              />

              <section className="boards-section">
                <h3>
                  <UserRound size={16} />
                  Your boards
                </h3>
                <div className="board-grid">
                  {boardsToShow.map((board) => (
                    <button
                      key={`workspace-${board.id}-main`}
                      type="button"
                      className="board-tile"
                      onClick={() => onOpenBoard(board)}
                    >
                      <span className={`board-tile-cover ${board.color}`} />
                      <strong>{board.title}</strong>
                    </button>
                  ))}
                  <button type="button" className="board-tile create-tile" onClick={() => setIsCreateModalOpen(true)}>
                    <span>Create new board</span>
                    <small>7 remaining</small>
                  </button>
                </div>
              </section>
            </>
          ) : activeSection === 'members' ? (
            <WorkspaceMembers currentUser={currentUser} />
          ) : activeSection === 'settings' ? (
            <WorkspaceSettings currentUser={currentUser} />
          ) : activeSection === 'templates' ? (
            <>
              <PopularTemplatesPanel
                selectedCategory={selectedTemplateCategory}
                onSelectCategory={setSelectedTemplateCategory}
                visibleTemplates={visibleTemplates}
                isDismissed={templatesPromoDismissed}
                onDismiss={() => setTemplatesPromoDismissed(true)}
                templateIdPrefix="boards"
                onTemplateSelect={handleTemplateSelect}
              />

              <section className="boards-section">
                <h3>
                  <Clock3 size={16} />
                  Recently viewed
                </h3>
                <div className="board-grid">
                  {boardsToShow.map((board) => (
                    <button
                      key={`recent-${board.id}`}
                      type="button"
                      className="board-tile"
                      onClick={() => onOpenBoard(board)}
                    >
                      <span className={`board-tile-cover ${board.color}`} />
                      <strong>{board.title}</strong>
                    </button>
                  ))}
                </div>
              </section>

              <section className="boards-section">
                <h4 className="workspace-section-title">YOUR WORKSPACES</h4>
                <div className="workspace-group-header">
                  <div className="workspace-group-name">
                    <span className="workspace-avatar">T</span>
                    <strong>Trello Workspace</strong>
                  </div>
                  <div className="workspace-group-actions">
                    <button type="button">Boards</button>
                    <button type="button">Members</button>
                    <button type="button">Settings</button>
                    <button type="button" className="upgrade-pill" onClick={handleUpgradeClick}>
                      Upgrade
                    </button>
                  </div>
                </div>
                <div className="board-grid">
                  {boardsToShow.slice(0, 3).map((board) => (
                    <button
                      key={`your-workspaces-${board.id}`}
                      type="button"
                      className="board-tile"
                      onClick={() => onOpenBoard(board)}
                    >
                      <span className={`board-tile-cover ${board.color}`} />
                      <strong>{board.title}</strong>
                    </button>
                  ))}
                  <button type="button" className="board-tile create-tile" onClick={() => setIsCreateModalOpen(true)}>
                    <span>Create new board</span>
                    <small>7 remaining</small>
                  </button>
                </div>
              </section>

              <section className="boards-section">
                <h4 className="workspace-section-title">
                  GUEST WORKSPACES <Info size={13} />
                </h4>
                <div className="workspace-group-header guest">
                  <div className="workspace-group-name">
                    <span className="workspace-avatar guest-avatar">T</span>
                    <strong>Trello workspace</strong>
                  </div>
                </div>
                <div className="board-grid guest-grid">
                  <button type="button" className="board-tile" onClick={() => onOpenBoard(boardsToShow[0])}>
                    <span className={`board-tile-cover ${boardsToShow[0]?.color ?? 'sunset'}`} />
                    <strong>{boardsToShow[0]?.title ?? 'ParentsPlus'}</strong>
                  </button>
                </div>
                <button type="button" className="closed-boards-btn">
                  View all closed boards
                </button>
              </section>
            </>
          ) : activeSection === 'search' ? (
            <AdvancedSearch
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              boards={boardsToShow}
              onOpenBoard={onOpenBoard}
            />
          ) : (
            <div className="home-dashboard">
              <section className="home-hero">
                <div className="hero-image" />
                <h2>Stay on track and up to date</h2>
                <p>
                  Invite people to boards and cards, leave comments, add due dates, and we&apos;ll show
                  the most important activity here.
                </p>
              </section>

              <aside className="home-right-panel">
                <h3>
                  <Clock3 size={14} />
                  Recently viewed
                </h3>
                <ul>
                  {boardsToShow.map((board) => (
                    <li key={`home-${board.id}`}>
                      <button type="button" className="recent-board" onClick={() => onOpenBoard(board)}>
                        <span className={`board-chip ${board.color}`} />
                        <span>
                          <strong>{board.title}</strong>
                          <small>{board.workspace}</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="link-block">
                  <p>Links</p>
                  <button
                    type="button"
                    className="new-board-link"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus size={14} />
                    Create new board
                  </button>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>

      {isCreateModalOpen && (
        <div
          className="create-board-overlay"
          onClick={() => setIsCreateModalOpen(false)}
          role="presentation"
        >
          <form
            className="create-board-modal"
            onSubmit={handleCreate}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="create-modal-close"
              aria-label="Close create board"
              onClick={() => setIsCreateModalOpen(false)}
            >
              <X size={15} />
            </button>
            <h3>Create board</h3>
            <div className={`create-board-preview ${selectedBackground.className}`}>
              <div className="mini-list">
                <span />
                <span />
                <span />
              </div>
              <div className="mini-list">
                <span />
                <span />
              </div>
              <div className="mini-list">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="background-picker">
              <p>Background</p>
              <div className="background-image-options">
                {BACKGROUND_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`board-image-pick ${preset.className} ${selectedBackgroundId === preset.id ? 'active' : ''}`}
                    onClick={() => setSelectedBackgroundId(preset.id)}
                    aria-label={`Select ${preset.id}`}
                  />
                ))}
                <button type="button" className="board-more-pick" aria-label="More backgrounds">
                  ...
                </button>
              </div>
              <div className="background-color-options">
                {BACKGROUND_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`board-color-pick ${preset.className} ${selectedBackgroundId === preset.id ? 'active' : ''}`}
                    onClick={() => setSelectedBackgroundId(preset.id)}
                    aria-label={`Select ${preset.id} color`}
                  />
                ))}
              </div>
            </div>
            <label>
              Board title
              <input
                type="text"
                className={!newBoardTitle.trim() ? 'invalid-input' : ''}
                value={newBoardTitle}
                onChange={(event) => setNewBoardTitle(event.target.value)}
                placeholder="e.g. Product launch roadmap"
                autoFocus
              />
            </label>
            {!newBoardTitle.trim() && (
              <p className="field-error">
                <BadgeHelp size={13} />
                Board title is required
              </p>
            )}
            <div className="visibility-group">
              <p>Visibility</p>
              {isVisibilityOpen && (
                <div className="visibility-dropdown" role="listbox" aria-label="Board visibility options">
                  {VISIBILITY_OPTIONS.map((option) => {
                    const Icon = option.icon
                    const active = option.id === visibility
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`visibility-option ${active ? 'active' : ''}`}
                        onClick={() => {
                          setVisibility(option.id)
                          setIsVisibilityOpen(false)
                        }}
                      >
                        <Icon size={14} />
                        <span>
                          <strong>{option.label}</strong>
                          <small>{option.description}</small>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
              <button
                type="button"
                className="visibility-select"
                onClick={() => setIsVisibilityOpen((current) => !current)}
              >
                <span>
                  <SelectedVisibilityIcon size={13} />
                  {selectedVisibility.label}
                </span>
                <ChevronDown size={14} />
              </button>
              <small>
                This Workspace has 7 boards remaining. Free Workspaces can only have 10 open boards.
                For unlimited boards, upgrade your Workspace.
              </small>
            </div>
            <button type="button" className="upgrade-action" onClick={handleUpgradeClick}>
              <Plus size={14} />
              Upgrade
            </button>
            <div className="create-board-actions stacked">
              <button
                type="submit"
                className="primary-action full-width"
                disabled={!newBoardTitle.trim()}
              >
                Create
              </button>
              <button type="button" className="ghost-action full-width" onClick={() => setIsCreateModalOpen(false)}>
                Start with a template
              </button>
            </div>
            <p className="legal-note">
              By using images from Unsplash, you agree to their license and Terms of Service.
            </p>
          </form>
        </div>
      )}
      {isProfileOpen ? (
        <div className="account-menu-overlay" onClick={() => setIsProfileOpen(false)} role="presentation" />
      ) : null}
      {isAppStoreOpen ? <AppStoreModal onClose={() => setIsAppStoreOpen(false)} /> : null}
    </div>
  )
}
