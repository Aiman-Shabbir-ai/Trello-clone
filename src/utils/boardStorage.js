const STORAGE_KEY = 'trello-clone-board-v2'

export function loadBoardState(fallback) {
  const base = {
    columns: fallback.columns,
    boardTitle: fallback.boardTitle ?? 'Board',
    backgroundColor: fallback.backgroundColor ?? 'violet',
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return base
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return { columns: parsed, boardTitle: base.boardTitle, backgroundColor: base.backgroundColor }
    }
    if (parsed && Array.isArray(parsed.columns)) {
      return {
        columns: parsed.columns,
        boardTitle: typeof parsed.boardTitle === 'string' ? parsed.boardTitle : base.boardTitle,
        backgroundColor:
          typeof parsed.backgroundColor === 'string' ? parsed.backgroundColor : base.backgroundColor,
      }
    }
    return base
  } catch {
    return base
  }
}

export function saveBoardState(columns, boardTitle, backgroundColor = 'violet') {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, boardTitle, backgroundColor }))
  } catch {
    // ignore quota / private mode
  }
}
