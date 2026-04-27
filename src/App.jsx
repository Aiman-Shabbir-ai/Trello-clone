import { useState } from 'react'
import './App.css'
import { boardData } from './data/boardData'
import { Board } from './components/Board'
import { Header } from './components/Header'
import { CardDetailsModal } from './components/CardDetailsModal'

function App() {
  const [columns, setColumns] = useState(boardData.columns)
  const [selectedCard, setSelectedCard] = useState(null)

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
      tags: [{ label: 'NEW', tone: 'blue' }],
      date: dueDate,
      comments: 0,
      commentList: [],
      assignees: [],
      progress: '0/1',
    }

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, cards: [...column.cards, newCard] } : column
      )
    )
  }

  return (
    <div className="app-shell">
      <Header />
      <Board columns={columns} onMoveCard={onMoveCard} onCardOpen={onOpenCard} onAddCard={onAddCard} />
      <CardDetailsModal card={selectedCard} onClose={onCloseCard} />
    </div>
  )
}

export default App
