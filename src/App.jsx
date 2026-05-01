import { useMemo, useState } from 'react'
import './App.css'
import { boardData } from './data/boardData'
import { Board } from './components/Board'
import { Header } from './components/Header'
import { CardDetailsModal } from './components/CardDetailsModal'
import { CreateCardModal } from './components/CreateCardModal'

function App() {
  const [columns, setColumns] = useState(boardData.columns)
  const [selectedCard, setSelectedCard] = useState(null)
  const [createCardColumnId, setCreateCardColumnId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const onMoveCard = (cardId, fromColumnId, toColumnId) => {
    if (!cardId || !fromColumnId || !toColumnId || fromColumnId === toColumnId) {
      return
    }

    setColumns((prevColumns) => {
      const sourceColumn = prevColumns.find((column) => column.id === fromColumnId)
      const targetColumn = prevColumns.find((column) => column.id === toColumnId)

      if (!sourceColumn || !targetColumn) {
        return prevColumns
      }

      const cardToMove = sourceColumn.cards.find((card) => card.id === cardId)
      if (!cardToMove) {
        return prevColumns
      }

      return prevColumns.map((column) => {
        if (column.id === fromColumnId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId),
          }
        }

        if (column.id === toColumnId) {
          return {
            ...column,
            cards: [...column.cards, cardToMove],
          }
        }

        return column
      })
    })
  }

  const onOpenCard = (card, columnTitle) => {
    setSelectedCard({ ...card, columnTitle })
  }

  const onCloseCard = () => {
    setSelectedCard(null)
  }

  const onOpenCreateCard = (columnId) => {
    setCreateCardColumnId(columnId)
  }

  const onCloseCreateCard = () => {
    setCreateCardColumnId(null)
  }

  const onAddCard = (columnId, payload) => {
    const title = payload.title.trim()
    const description = payload.description.trim()

    if (!title) {
      return
    }

    const dueDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    const newCard = {
      id: `${columnId}-${Date.now()}`,
      title,
      description: description || 'No description added yet.',
      tags: payload.labels?.length ? payload.labels : [{ label: 'NEW', tone: 'blue' }],
      date: dueDate,
      comments: 0,
      commentList: [],
      assignees: payload.members?.length ? payload.members : [],
      progress: '0/1',
    }

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, cards: [...column.cards, newCard] } : column
      )
    )
    onCloseCreateCard()
  }

  const activeCreateColumn = columns.find((column) => column.id === createCardColumnId)
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const filteredColumns = useMemo(() => {
    if (!normalizedSearchQuery) {
      return columns
    }

    const matchesQuery = (card, columnTitle) => {
      const title = card.title?.toLowerCase() ?? ''
      const description = card.description?.toLowerCase() ?? ''
      const labels = (card.tags ?? []).map((tag) => tag.label?.toLowerCase() ?? '').join(' ')
      const assignees = (card.assignees ?? [])
        .map((member) => `${member.name ?? ''} ${member.id ?? ''}`.toLowerCase())
        .join(' ')
      const commentAuthors = (card.commentList ?? [])
        .map((comment) => comment.author?.toLowerCase() ?? '')
        .join(' ')
      const searchableText = [title, description, labels, assignees, commentAuthors, columnTitle]
        .filter(Boolean)
        .join(' ')

      return searchableText.includes(normalizedSearchQuery)
    }

    return columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => matchesQuery(card, column.title.toLowerCase())),
    }))
  }, [columns, normalizedSearchQuery])

  return (
    <div className="app-shell">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Board
        columns={filteredColumns}
        searchQuery={searchQuery}
        onMoveCard={onMoveCard}
        onCardOpen={onOpenCard}
        onAddCard={onOpenCreateCard}
      />
      <CardDetailsModal card={selectedCard} onClose={onCloseCard} />
      <CreateCardModal
        isOpen={Boolean(activeCreateColumn)}
        columnTitle={activeCreateColumn ? `${activeCreateColumn.title} Column` : ''}
        onClose={onCloseCreateCard}
        onSubmit={(payload) => onAddCard(createCardColumnId, payload)}
      />
    </div>
  )
}

export default App
