import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import { Board } from './Board'
import { Header } from './Header'
import { CardDetailsModal } from './CardDetailsModal'
import { CreateCardModal } from './CreateCardModal'
import { getBoard, updateBoard } from '../utils/boardApi'
import { moveCardToIndex } from '../utils/moveCard'

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

function mapBoardPreview(board, workspaceName) {
  return {
    id: board._id,
    title: board.boardTitle ?? 'Untitled board',
    workspace: workspaceName ?? 'Trello Workspace',
    color: board.backgroundColor ?? 'violet',
    columns: board.columns ?? [],
  }
}

export function BoardView({ recentBoards, setRecentBoards, workspaceName, onUnauthorized }) {
  const navigate = useNavigate()
  const { boardId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [columns, setColumns] = useState([])
  const [boardTitle, setBoardTitle] = useState('Board')
  const [boardBackgroundColor, setBoardBackgroundColor] = useState('violet')
  const [isRemoteLoaded, setIsRemoteLoaded] = useState(false)
  const [selection, setSelection] = useState(null)
  const [createCardColumnId, setCreateCardColumnId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLabels, setFilterLabels] = useState([])

  const applyBoardState = useCallback(
    (board) => {
      if (!board) {
        return
      }
      setColumns(board.columns ?? [])
      setBoardTitle(board.boardTitle ?? 'Board')
      setBoardBackgroundColor(board.backgroundColor ?? 'violet')
      setRecentBoards((prev) => {
        const preview = mapBoardPreview(board, workspaceName)
        const withoutCurrent = prev.filter((item) => item.id !== preview.id)
        return [preview, ...withoutCurrent]
      })
    },
    [setRecentBoards, workspaceName]
  )

  useEffect(() => {
    if (!boardId) {
      navigate('/home', { replace: true })
      return
    }

    let isCancelled = false

    const loadBoard = async () => {
      setIsLoading(true)
      setLoadError('')
      setIsRemoteLoaded(false)
      setSelection(null)
      setCreateCardColumnId(null)
      setSearchQuery('')
      setFilterLabels([])

      const cached = recentBoards.find((board) => board.id === boardId)
      if (cached) {
        setColumns(cached.columns ?? [])
        setBoardTitle(cached.title ?? 'Board')
        setBoardBackgroundColor(cached.color ?? 'violet')
      }

      try {
        const remoteBoard = await getBoard(boardId)
        if (isCancelled) {
          return
        }
        applyBoardState(remoteBoard)
      } catch (error) {
        if (isCancelled) {
          return
        }
        if (onUnauthorized?.(error)) {
          navigate('/login', { replace: true })
          return
        }
        if (!cached) {
          setLoadError(error.message || 'Failed to load board')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
          setIsRemoteLoaded(true)
        }
      }
    }

    loadBoard()

    return () => {
      isCancelled = true
    }
    // recentBoards is read only for an instant preview before the API response.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, applyBoardState, navigate, onUnauthorized])

  useEffect(() => {
    if (!isRemoteLoaded || !boardId) {
      return
    }

    updateBoard(boardId, { columns, boardTitle, backgroundColor: boardBackgroundColor }).catch((error) => {
      if (onUnauthorized?.(error)) {
        navigate('/login', { replace: true })
      }
    })
  }, [columns, boardTitle, boardBackgroundColor, isRemoteLoaded, boardId, navigate, onUnauthorized])

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

  if (isLoading && columns.length === 0 && !loadError) {
    return (
      <div className="app-shell board-view-loading" style={{ background: BOARD_BACKGROUND_STYLES.violet }}>
        <p>Loading board...</p>
      </div>
    )
  }

  if (loadError && columns.length === 0) {
    return (
      <div className="app-shell board-view-loading" style={{ background: BOARD_BACKGROUND_STYLES.violet }}>
        <p>{loadError}</p>
        <button type="button" onClick={() => navigate('/home')}>
          Back to boards
        </button>
      </div>
    )
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
        onGoHome={() => navigate('/home')}
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
