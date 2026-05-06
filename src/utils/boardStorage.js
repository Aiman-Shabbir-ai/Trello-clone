const STORAGE_KEY = 'trello-clone-board-v2'

function getScopedStorageKey(scopeKey) {
  return scopeKey ? `${STORAGE_KEY}:${scopeKey}` : STORAGE_KEY
}

export function loadBoardState(fallback, scopeKey = '') {
  const base = {
    columns: fallback.columns,
    boardTitle: fallback.boardTitle ?? 'Board',
    backgroundColor: fallback.backgroundColor ?? 'violet',
  }
  try {
    const raw = localStorage.getItem(getScopedStorageKey(scopeKey))
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

export function saveBoardState(columns, boardTitle, backgroundColor = 'violet', scopeKey = '') {
  try {
    localStorage.setItem(
      getScopedStorageKey(scopeKey),
      JSON.stringify({ columns, boardTitle, backgroundColor })
    )
  } catch {
    // ignore quota / private mode
  }
}
