export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let currentPage = startPage; currentPage <= endPage; currentPage += 1) {
    pages.push(currentPage);
  }

  return (
    <nav className="pagination" aria-label="Task pagination">
      <button
        type="button"
        className="button button-ghost"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>

      <div className="pagination-pages">
        {pages.map((item) => (
          <button
            key={item}
            type="button"
            className={`page-pill ${item === page ? 'active' : ''}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="button button-ghost"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </nav>
  );
}
