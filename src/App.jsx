import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { boardData } from './data/boardData'
import { Board } from './components/Board'
import { Header } from './components/Header'
import { CardDetailsModal } from './components/CardDetailsModal'
import { CreateCardModal } from './components/CreateCardModal'
import { AuthScreen } from './components/AuthScreen'
import { HomePage } from './components/HomePage'
import { TemplateGallery } from './components/TemplateGallery'
import { clearStoredToken, loginUser, registerUser } from './utils/authApi'
import { createBoard, getBoards, updateBoard } from './utils/boardApi'
import { moveCardToIndex } from './utils/moveCard'

const AUTH_SESSION_KEY = 'trello-clone-session-user'
const BOARD_BACKGROUND_STYLES = {
  sunset: 'linear-gradient(135deg, #f97316 0%, #fb7185 100%)',
  violet: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)',
  teal: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
  pink: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
}

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getDropIndex(event, container) {
  const nodes = [...container.querySelectorAll('[data-card-id]')]
  if (nodes.length === 0) {
    return 0
  }

  let insertIndex = nodes.length
  for (let i = 0; i < nodes.length; i += 1) {
    const rect = nodes[i].getBoundingClientRect()
    if (event.clientY < rect.top + rect.height / 2) {
      insertIndex = i
      break
    }
  }
  return insertIndex
}

function getStarterColumns() {
  return [
    { id: `todo-${Date.now()}`, title: 'To Do', cards: [] },
    { id: `doing-${Date.now() + 1}`, title: 'Doing', cards: [] },
    { id: `done-${Date.now() + 2}`, title: 'Done', cards: [] },
  ]
}

function App() {
  const [isBoardsLoading, setIsBoardsLoading] = useState(false)
  const [boardsError, setBoardsError] = useState('')
  const [boardId, setBoardId] = useState('')
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [activeView, setActiveView] = useState('home')
  const [recentBoards, setRecentBoards] = useState([])
  const [columns, setColumns] = useState(() => boardData.columns)
  const [boardTitle, setBoardTitle] = useState(() => boardData.boardTitle)
  const [boardBackgroundColor, setBoardBackgroundColor] = useState(
    () => boardData.backgroundColor ?? 'violet'
  )
  const [isRemoteLoaded, setIsRemoteLoaded] = useState(false)
  const [selection, setSelection] = useState(null)
  const [createCardColumnId, setCreateCardColumnId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLabels, setFilterLabels] = useState([])

  const applyBoardState = (board) => {
    if (!board) {
      return
    }
    setBoardId(board._id)
    setColumns(board.columns ?? [])
    setBoardTitle(board.boardTitle ?? 'Board')
    setBoardBackgroundColor(board.backgroundColor ?? 'violet')
  }

  const mapBoardPreview = (board) => ({
    id: board._id,
    title: board.boardTitle ?? 'Untitled board',
    workspace: currentUser?.workspaceName ?? 'Trello Workspace',
    color: board.backgroundColor ?? 'violet',
    columns: board.columns ?? [],
  })

  const handleUnauthorized = useCallback((error) => {
    if (error?.status !== 401) {
      return false
    }
    clearStoredToken()
    localStorage.removeItem(AUTH_SESSION_KEY)
    setCurrentUser(null)
    return true
  }, [])

  useEffect(() => {
    setColumns(boardData.columns)
    setBoardTitle(boardData.boardTitle)
    setBoardBackgroundColor(boardData.backgroundColor ?? 'violet')
    setBoardId('')
    setActiveView('home')
    setSelection(null)
    setCreateCardColumnId(null)
    setSearchQuery('')
    setFilterLabels([])
    setRecentBoards([])
    setBoardsError('')
    setIsBoardsLoading(false)
    setIsRemoteLoaded(false)
  }, [currentUser?.email])

  useEffect(() => {
    if (!currentUser?.email) {
      return
    }

    let isCancelled = false

    setIsBoardsLoading(true)
    setBoardsError('')
    getBoards()
      .then((remoteBoards) => {
        if (isCancelled) {
          return
        }
        const normalizedBoards = Array.isArray(remoteBoards) ? remoteBoards : []
        setRecentBoards(normalizedBoards.map(mapBoardPreview))
        const existingBoard = normalizedBoards[0] ?? null
        if (existingBoard) {
          applyBoardState(existingBoard)
        }
      })
      .catch((error) => {
        if (isCancelled || handleUnauthorized(error)) {
          return
        }
        setBoardsError(error.message || 'Failed to load boards')
      })
      .finally(() => {
        if (!isCancelled) {
          setIsBoardsLoading(false)
          setIsRemoteLoaded(true)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [currentUser?.email])

  useEffect(() => {
    if (!isRemoteLoaded) {
      return
    }

    if (!currentUser?.email) {
      return
    }
    if (!boardId) {
      return
    }

    updateBoard(boardId, { columns, boardTitle, backgroundColor: boardBackgroundColor }).catch((error) => {
      if (handleUnauthorized(error)) {
        return
      }
      // Keep UI responsive; next successful sync will persist state.
    })
  }, [columns, boardTitle, boardBackgroundColor, isRemoteLoaded, currentUser?.email, boardId])

  const selectedCardView = useMemo(() => {
    if (!selection) {
      return null
    }
    const column = columns.find((item) => item.id === selection.columnId)
    const card = column?.cards.find((item) => item.id === selection.cardId)
    if (!column || !card) {
      return null
    }
    return { card, columnId: column.id, columnTitle: column.title }
  }, [columns, selection])

  const onMoveCard = (cardId, fromColumnId, toColumnId, event) => {
    if (!cardId || !fromColumnId || !toColumnId) {
      return
    }

    const container = event.currentTarget
    const insertIndex = getDropIndex(event, container)

    setColumns((prev) => moveCardToIndex(prev, cardId, fromColumnId, toColumnId, insertIndex))
  }

  const onOpenCard = (card, columnId, columnTitle) => {
    setSelection({ columnId, cardId: card.id, columnTitle })
  }

  const onCloseCard = () => {
    setSelection(null)
  }

  const onOpenCreateCard = (columnId) => {
    setCreateCardColumnId(columnId)
  }

  const onCloseCreateCard = () => {
    setCreateCardColumnId(null)
  }

  const onUpdateCard = (columnId, cardId, patch) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) => (card.id === cardId ? { ...card, ...patch } : card)),
            }
          : column
      )
    )
  }

  const onArchiveCard = (columnId, cardId) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column
      )
    )
    setSelection((current) => (current?.cardId === cardId ? null : current))
  }

  const onDeleteCard = (columnId, cardId) => {
    onArchiveCard(columnId, cardId)
  }

  const onAddCard = (columnId, payload) => {
    const title = payload.title.trim()
    const description = payload.description.trim()

    if (!title) {
      return
    }

    const newCard = {
      id: newId(columnId),
      title,
      description: description || 'No description added yet.',
      tags: payload.labels?.length ? payload.labels : [{ label: 'NEW', tone: 'blue' }],
      dueDate: payload.dueDate || null,
      commentList: [],
      assignees: payload.members?.length ? payload.members : [],
      checklist: [],
      done: false,
    }

    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId ? { ...column, cards: [...column.cards, newCard] } : column
      )
    )
    onCloseCreateCard()
  }

  const onAddColumn = (title) => {
    const label = title.trim()
    if (!label) {
      return
    }

    setColumns((prev) => [...prev, { id: newId('list'), title: label, cards: [] }])
  }

  const onDeleteColumn = (columnId) => {
    setColumns((prev) => prev.filter((column) => column.id !== columnId))
    setSelection((current) => (current?.columnId === columnId ? null : current))
    setCreateCardColumnId((current) => (current === columnId ? null : current))
  }

  const onRenameBoard = (title) => {
    const next = title.trim()
    if (!next) {
      return
    }
    setBoardTitle(next)
  }

  const activeCreateColumn = columns.find((column) => column.id === createCardColumnId)
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const filteredColumns = useMemo(() => {
    let next = columns

    if (filterLabels.length > 0) {
      next = next.map((column) => ({
        ...column,
        cards: column.cards.filter((card) =>
          (card.tags ?? []).some((tag) => filterLabels.includes(tag.label))
        ),
      }))
    }

    if (!normalizedSearchQuery) {
      return next
    }

    const matchesQuery = (card, columnTitle) => {
      const title = card.title?.toLowerCase() ?? ''
      const description = card.description?.toLowerCase() ?? ''
      const labels = (card.tags ?? []).map((tag) => tag.label?.toLowerCase() ?? '').join(' ')
      const assignees = (card.assignees ?? [])
        .map((member) => `${member.name ?? ''} ${member.id ?? ''}`.toLowerCase())
        .join(' ')
      const commentAuthors = (card.commentList ?? [])
        .map((comment) => `${comment.author ?? ''} ${comment.text ?? ''}`.toLowerCase())
        .join(' ')
      const searchableText = [title, description, labels, assignees, commentAuthors, columnTitle]
        .filter(Boolean)
        .join(' ')

      return searchableText.includes(normalizedSearchQuery)
    }

    return next.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => matchesQuery(card, column.title.toLowerCase())),
    }))
  }, [columns, normalizedSearchQuery, filterLabels])

  const totalCards = useMemo(
    () => columns.reduce((sum, column) => sum + column.cards.length, 0),
    [columns]
  )
  const visibleCards = useMemo(
    () => filteredColumns.reduce((sum, column) => sum + column.cards.length, 0),
    [filteredColumns]
  )

  const isBoardFiltered = totalCards !== visibleCards

  const onCreateBoard = async ({ title, color, columns: templateColumns }) => {
    const nextColor = color ?? 'violet'
    const payload = {
      boardTitle: title,
      backgroundColor: nextColor,
      columns:
        Array.isArray(templateColumns) && templateColumns.length > 0 ? templateColumns : getStarterColumns(),
    }

    const createdBoard = await createBoard(payload).catch((error) => {
      if (handleUnauthorized(error)) {
        return null
      }
      throw error
    })
    if (!createdBoard) {
      return
    }

    applyBoardState(createdBoard)
    setSelection(null)
    setCreateCardColumnId(null)
    setSearchQuery('')
    setFilterLabels([])
    setActiveView('board')
    setRecentBoards((prev) => [mapBoardPreview(createdBoard), ...prev.filter((board) => board.id !== createdBoard._id)])
  }

  const onAuthenticate = async ({ fullName, email, password, mode }) => {
    const payload =
      mode === 'signup'
        ? await registerUser({ name: fullName || email.split('@')[0], email, password })
        : await loginUser({ email, password })

    const backendUser = payload?.user
    if (!backendUser?.email) {
      throw new Error('Invalid auth response from server')
    }

    const user = {
      id: backendUser.id,
      email: backendUser.email,
      fullName: backendUser.name,
      workspaceName: `${backendUser.name.split(' ')[0]} Workspace`,
    }

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user))
    setCurrentUser(user)
  }

  const onLogout = () => {
    clearStoredToken()
    localStorage.removeItem(AUTH_SESSION_KEY)
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <AuthScreen onAuthenticate={onAuthenticate} />
  }

  if (activeView === 'home') {
    return (
      <HomePage
        currentUser={currentUser}
        recentBoards={recentBoards}
        isLoadingBoards={isBoardsLoading}
        boardsError={boardsError}
        onOpenBoard={(board) => {
          setBoardsError('')
          setBoardId(board.id)
          setColumns(board.columns ?? [])
          setBoardTitle(board.title ?? 'Board')
          setBoardBackgroundColor(board.color ?? 'violet')
          setActiveView('board')
        }}
        onCreateBoard={onCreateBoard}
        onOpenTemplates={() => setActiveView('templates')}
        onLogout={onLogout}
      />
    )
  }

  if (activeView === 'templates') {
    return <TemplateGallery onGoHome={() => setActiveView('home')} />
  }

  return (
    <div
      className="app-shell"
      style={{ background: BOARD_BACKGROUND_STYLES[boardBackgroundColor] ?? BOARD_BACKGROUND_STYLES.violet }}
    >
      <Header
        boardTitle={boardTitle}
        onRenameBoard={onRenameBoard}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterLabels={filterLabels}
        onFilterLabelsChange={setFilterLabels}
        onGoHome={() => setActiveView('home')}
      />
      <Board
        columns={filteredColumns}
        totalCards={totalCards}
        visibleCards={visibleCards}
        isBoardFiltered={isBoardFiltered}
        searchQuery={searchQuery}
        filterLabels={filterLabels}
        onMoveCard={onMoveCard}
        onCardOpen={onOpenCard}
        onAddCard={onOpenCreateCard}
        onAddColumn={onAddColumn}
        onDeleteColumn={onDeleteColumn}
        onDeleteCard={onDeleteCard}
      />
      <CardDetailsModal
        key={selectedCardView ? selectedCardView.card.id : 'no-card'}
        selection={selectedCardView}
        columns={columns}
        onClose={onCloseCard}
        onUpdateCard={onUpdateCard}
        onArchiveCard={onArchiveCard}
        onMoveCard={(cardId, fromColumnId, toColumnId) => {
          setColumns((prev) => {
            const target = prev.find((column) => column.id === toColumnId)
            const insertIndex = target ? target.cards.length : 0
            return moveCardToIndex(prev, cardId, fromColumnId, toColumnId, insertIndex)
          })
        }}
      />
      <CreateCardModal
        key={createCardColumnId ?? 'closed'}
        isOpen={Boolean(activeCreateColumn)}
        columnTitle={activeCreateColumn ? `${activeCreateColumn.title}` : ''}
        onClose={onCloseCreateCard}
        onSubmit={(payload) => onAddCard(createCardColumnId, payload)}
      />
    </div>
  )
}

export default App
