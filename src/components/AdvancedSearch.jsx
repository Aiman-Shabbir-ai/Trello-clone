import { Info, Star } from 'lucide-react'

export function AdvancedSearch({ searchQuery, onSearchQueryChange, boards, onOpenBoard }) {
  return (
    <section className="advanced-search-view">
      <h2>Search</h2>

      <label className="advanced-search-input-wrap" htmlFor="advanced-search-input">
        <Info size={16} />
        <input
          id="advanced-search-input"
          type="text"
          placeholder="Enter your search keyword here"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
        />
      </label>

      <div className="advanced-search-results">
        <h3>Recent boards</h3>
        <div className="advanced-search-list">
          {boards.map((board, index) => (
            <button
              key={`advanced-search-${board.id}-${index}`}
              type="button"
              className="advanced-search-row"
              onClick={() => onOpenBoard(board)}
            >
              <span className={`advanced-search-thumb ${board.color}`} />
              <span className="advanced-search-copy">
                <strong>{board.title}</strong>
                <small>{board.workspace}</small>
              </span>
              <small className="advanced-search-time">Updated {34 + index * 9} minutes ago</small>
              <span className="advanced-search-star">
                <Star size={15} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
