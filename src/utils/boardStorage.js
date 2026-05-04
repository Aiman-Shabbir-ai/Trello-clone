const STORAGE_KEY = 'trello-clone-board-v2'

export function loadBoardState(fallback) {
  const base = {
    columns: fallback.columns,
    boardTitle: fallback.boardTitle ?? 'Board',
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return base
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return { columns: parsed, boardTitle: base.boardTitle }
    }
    if (parsed && Array.isArray(parsed.columns)) {
      return {
        columns: parsed.columns,
        boardTitle: typeof parsed.boardTitle === 'string' ? parsed.boardTitle : base.boardTitle,
      }
    }
    return base
  } catch {
    return base
  }
}

export function saveBoardState(columns, boardTitle) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, boardTitle }))
  } catch {
    // ignore quota / private mode
  }
}
