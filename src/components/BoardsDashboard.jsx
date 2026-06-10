import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  Clock3,
  Info,
  LayoutTemplate,
  Settings,
  Sparkles,
  SquareKanban,
  Users,
} from 'lucide-react'

const TEMPLATE_TONE_BG = {
  'template-orange': 'bg-gradient-to-br from-orange-400 to-orange-300',
  'template-green': 'bg-gradient-to-br from-emerald-300 to-lime-300',
  'template-blue': 'bg-gradient-to-br from-slate-600 to-blue-800',
  'template-gold': 'bg-gradient-to-br from-amber-700 to-yellow-400',
  'template-teal': 'bg-gradient-to-br from-teal-600 to-teal-300',
  'template-violet': 'bg-gradient-to-br from-indigo-500 to-purple-500',
  'template-slate': 'bg-gradient-to-br from-slate-500 to-slate-400',
  'template-coral': 'bg-gradient-to-br from-orange-500 to-pink-400',
  'template-mint': 'bg-gradient-to-br from-emerald-400 to-emerald-300',
}

const BOARD_COVER_BG = {
  sunset:
    'bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.42)),linear-gradient(120deg,#c4d4e9_0%,#8c6f52_48%,#4d3626_100%)]',
  violet:
    'bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.45)),linear-gradient(120deg,#f472b6_0%,#a855f7_52%,#7c3aed_100%)]',
  teal: 'bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.45)),linear-gradient(120deg,#93c5fd_0%,#2563eb_46%,#0b3f97_100%)]',
  pink: 'bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.45)),linear-gradient(120deg,#f9a8d4_0%,#c084fc_50%,#9333ea_100%)]',
}

const RECENTLY_VIEWED_PLACEHOLDER = [
  { id: 'rv-1', title: 'Trello Agile Sprint Board Template', color: 'teal', isTemplate: true },
  { id: 'rv-2', title: 'Project Management', color: 'violet', isTemplate: true },
  { id: 'rv-3', title: 'AI-Based Fake News Detection', color: 'sunset', isTemplate: false },
  { id: 'rv-4', title: 'My Trello board', color: 'pink', isTemplate: false },
]

const GUEST_BOARDS_PLACEHOLDER = [
  { id: 'guest-1', title: 'ParentsPlus', color: 'sunset' },
]

const WORKSPACE_DISPLAY_NAME = 'Trello Workspace'

function BoardCard({ board, onOpen, compact = false, showTemplateBadge = false }) {
  const coverClass = BOARD_COVER_BG[board.color] ?? BOARD_COVER_BG.violet
  const heightClass = compact ? 'h-[52px]' : 'h-[66px]'

  return (
    <button
      type="button"
      onClick={() => onOpen(board)}
      className="group w-full overflow-hidden rounded-[10px] border border-[#323a47] bg-[#222833] text-left transition hover:border-[#579dff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#579dff]"
    >
      <span className={`relative block w-full ${heightClass} ${coverClass}`}>
        {(showTemplateBadge || board.isTemplate) && (
          <span className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#172b4d] bg-white/90">
            Template
          </span>
        )}
      </span>
      <span className="block px-2 py-2 text-[13px] font-normal leading-snug text-[#dfe1e6] group-hover:text-white">
        {board.title}
      </span>
    </button>
  )
}

function TemplateCategoryDropdown({ categories, selectedCategory, onSelectCategory }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDocMouseDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  return (
    <span className="relative inline-flex shrink-0" ref={wrapRef}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md border-0 bg-transparent px-0 py-0 text-[14px] font-medium text-[#85b8ff] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#579dff]"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        {selectedCategory}
        <ChevronDown size={14} aria-hidden />
      </button>
      {open ? (
        <ul
          className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[200px] overflow-hidden rounded-lg border border-[#3c4658] bg-[#1f232a] py-1 shadow-xl"
          role="listbox"
        >
          {categories.map((category) => (
            <li key={category} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={category === selectedCategory}
                className={`w-full px-3 py-2 text-left text-[13px] ${
                  category === selectedCategory
                    ? 'bg-[#1d3a63] text-[#85b8ff]'
                    : 'text-[#dfe1e6] hover:bg-[#2a313d]'
                }`}
                onClick={() => {
                  onSelectCategory(category)
                  setOpen(false)
                }}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  )
}

function WorkspaceNavRow({ activeTab = 'boards', onUpgrade }) {
  const tabClass = (tab) =>
    `inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] transition ${
      activeTab === tab
        ? 'border-[#1d3a63] bg-[#1d3a63] text-[#85b8ff]'
        : 'border-transparent bg-transparent text-[#9fadbc] hover:bg-[#2a313d] hover:text-[#dfe1e6]'
    }`

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button type="button" className={tabClass('boards')}>
        <SquareKanban size={14} />
        Boards
      </button>
      <button type="button" className={tabClass('members')}>
        <Users size={14} />
        Members
      </button>
      <button type="button" className={tabClass('settings')}>
        <Settings size={14} />
        Settings
      </button>
      <button
        type="button"
        className="inline-flex items-center rounded-lg border border-transparent bg-gradient-to-r from-violet-900 to-purple-700 px-3 py-1.5 text-[13px] font-medium text-white hover:from-violet-800 hover:to-purple-600"
        onClick={onUpgrade}
      >
        Upgrade
      </button>
    </div>
  )
}

export function BoardsDashboard({
  view = 'boards',
  boards,
  isLoadingBoards,
  boardsError,
  templates,
  templateCategories,
  selectedTemplateCategory,
  onSelectTemplateCategory,
  onTemplateSelect,
  onOpenBoard,
  onCreateBoard,
  onUpgrade,
}) {
  const isWorkspaceView = view === 'workspace'
  const recentlyViewed =
    boards.length > 0
      ? boards.slice(0, 4).map((board) => ({
          ...board,
          isTemplate: /template/i.test(board.title ?? ''),
        }))
      : RECENTLY_VIEWED_PLACEHOLDER

  const workspaceBoards = boards.length > 0 ? boards : RECENTLY_VIEWED_PLACEHOLDER

  const workspaceHeader = (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-[#22a06b] text-[13px] font-bold text-[#041b11]">
          T
        </span>
        <span className="text-[17px] font-semibold text-[#f1f4f7]">{WORKSPACE_DISPLAY_NAME}</span>
      </div>
      <WorkspaceNavRow activeTab="boards" onUpgrade={onUpgrade} />
    </div>
  )

  const boardsGrid = (
    <>
      {isLoadingBoards ? <p className="mb-3 text-sm text-[#9fadbc]">Loading boards...</p> : null}
      {boardsError ? <p className="mb-3 text-sm text-rose-300">{boardsError}</p> : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {workspaceBoards.map((board) => (
          <BoardCard key={`ws-${board.id}`} board={board} onOpen={onOpenBoard} />
        ))}
        <button
          type="button"
          onClick={onCreateBoard}
          className="flex min-h-[94px] flex-col items-center justify-center gap-0.5 rounded-[10px] border border-[#323a47] bg-[#2a2f39] text-center transition hover:bg-[#323a47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#579dff]"
        >
          <span className="text-[15px] text-[#dfe1e6]">Create new board</span>
          <span className="text-[12px] text-[#9fadbc]">7 remaining</span>
        </button>
      </div>
    </>
  )

  if (isWorkspaceView) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <section>
          {workspaceHeader}
          {boardsGrid}
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-12 pb-10">
      {/* Most popular templates */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-[#9fadbc]">
              <LayoutTemplate size={22} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[18px] font-semibold leading-tight text-[#f1f4f7]">
                Most popular templates
              </h2>
              <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-[#9fadbc]">
                Get going faster with a template from the Trello community or
              </p>
            </div>
          </div>
          <div className="shrink-0 sm:mt-1 sm:self-end">
            <TemplateCategoryDropdown
              categories={templateCategories}
              selectedCategory={selectedTemplateCategory}
              onSelectCategory={onSelectTemplateCategory}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {templates.slice(0, 4).map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateSelect(template)}
              className="group overflow-hidden rounded-[10px] border border-[#323a47] bg-[#222833] text-left transition hover:-translate-y-0.5 hover:border-[#579dff] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#579dff]"
            >
              <span
                className={`block h-[66px] w-full ${TEMPLATE_TONE_BG[template.tone] ?? TEMPLATE_TONE_BG['template-violet']}`}
              />
              <span className="flex flex-col gap-0.5 px-2.5 py-2">
                <span className="text-[13px] text-[#dfe1e6]">{template.title}</span>
                <span className="text-[11px] text-[#91a3b8]">
                  {template.lists?.length ?? 0} lists •{' '}
                  {(template.lists ?? []).reduce((sum, list) => sum + (list.initialCards?.length ?? 0), 0)}{' '}
                  cards
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#85b8ff]">
                  <Sparkles size={12} />
                  Use template
                </span>
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mt-3 border-0 bg-transparent p-0 text-[14px] font-medium text-[#85b8ff] hover:underline"
        >
          Browse the full template gallery
        </button>
      </section>

      {/* Recently viewed */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-[#eaf0f6]">
          <Clock3 size={16} className="text-[#9fadbc]" />
          Recently viewed
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {recentlyViewed.map((board) => (
            <BoardCard
              key={`recent-${board.id}`}
              board={board}
              onOpen={onOpenBoard}
              compact
              showTemplateBadge={board.isTemplate}
            />
          ))}
        </div>
      </section>

      {/* Your workspaces */}
      <section>
        <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8c9bab]">
          YOUR WORKSPACES
        </h4>
        {workspaceHeader}
        {boardsGrid}
      </section>

      {/* Guest workspaces */}
      <section>
        <h4 className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8c9bab]">
          GUEST WORKSPACES
          <Info size={13} className="text-[#8c9bab]" aria-hidden />
        </h4>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-pink-400 to-purple-500 text-[13px] font-bold text-[#2a1232]">
            T
          </span>
          <span className="text-[17px] font-semibold text-[#f1f4f7]">Trello workspace</span>
        </div>
        <div className="grid max-w-[240px] grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4">
          {(boards[0] ? [boards[0]] : GUEST_BOARDS_PLACEHOLDER).map((board) => (
            <BoardCard key={`guest-${board.id}`} board={board} onOpen={onOpenBoard} />
          ))}
        </div>
        <button
          type="button"
          className="mt-4 rounded-lg border border-[#3b4351] bg-[#242a33] px-3 py-2 text-[13px] text-[#c7d1db] hover:bg-[#2a313d]"
        >
          View all closed boards
        </button>
      </section>
    </div>
  )
}
