import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import { AuthScreen } from './components/AuthScreen'
import { HomePage } from './components/HomePage'
import { TemplateGallery } from './components/TemplateGallery'
import { BoardView } from './components/BoardView'
import { clearStoredToken, loginUser, registerUser } from './utils/authApi'
import { createBoard, getBoards } from './utils/boardApi'

const AUTH_SESSION_KEY = 'trello-clone-session-user'

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getStarterColumns() {
  return [
    { id: `todo-${Date.now()}`, title: 'To Do', cards: [] },
    { id: `doing-${Date.now() + 1}`, title: 'Doing', cards: [] },
    { id: `done-${Date.now() + 2}`, title: 'Done', cards: [] },
  ]
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

function ProtectedApp({ currentUser, setCurrentUser, handleUnauthorized }) {
  const navigate = useNavigate()
  const [isBoardsLoading, setIsBoardsLoading] = useState(false)
  const [boardsError, setBoardsError] = useState('')
  const [recentBoards, setRecentBoards] = useState([])

  const workspaceName = currentUser?.workspaceName ?? 'Trello Workspace'

  useEffect(() => {
    setRecentBoards([])
    setBoardsError('')
    setIsBoardsLoading(false)
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
        setRecentBoards(normalizedBoards.map((board) => mapBoardPreview(board, workspaceName)))
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
        }
      })

    return () => {
      isCancelled = true
    }
  }, [currentUser?.email, workspaceName, handleUnauthorized])

  const onOpenBoard = (board) => {
    if (!board?.id) {
      return
    }
    navigate(`/b/${board.id}`)
  }

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

    const preview = mapBoardPreview(createdBoard, workspaceName)
    setRecentBoards((prev) => [preview, ...prev.filter((board) => board.id !== preview.id)])
    navigate(`/b/${createdBoard._id}`)
  }

  const handleLogout = () => {
    clearStoredToken()
    localStorage.removeItem(AUTH_SESSION_KEY)
    setCurrentUser(null)
    navigate('/login')
  }

  const homePageProps = {
    currentUser,
    recentBoards,
    isLoadingBoards: isBoardsLoading,
    boardsError,
    onOpenBoard,
    onCreateBoard,
    onLogout: handleLogout,
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage {...homePageProps} />} />
      <Route path="/boards" element={<HomePage {...homePageProps} />} />
      <Route path="/workspace" element={<HomePage {...homePageProps} />} />
      <Route path="/workspace/members" element={<HomePage {...homePageProps} />} />
      <Route path="/workspace/settings" element={<HomePage {...homePageProps} />} />
      <Route path="/search" element={<HomePage {...homePageProps} />} />
      <Route path="/templates" element={<TemplateGallery onGoHome={() => navigate('/home')} />} />
      <Route
        path="/b/:boardId"
        element={
          <BoardView
            recentBoards={recentBoards}
            setRecentBoards={setRecentBoards}
            workspaceName={workspaceName}
            onUnauthorized={handleUnauthorized}
          />
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

function App() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
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
    navigate('/home')
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/home" replace /> : <AuthScreen onAuthenticate={onAuthenticate} />}
      />
      <Route
        path="/*"
        element={
          currentUser ? (
            <ProtectedApp
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              handleUnauthorized={handleUnauthorized}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App
