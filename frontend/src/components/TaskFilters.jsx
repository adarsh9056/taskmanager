export default function TaskFilters({ filters, onChange, onReset }) {
  return (
    <section className="filters-panel">
      <div className="filters-header">
        <div>
          <p className="eyebrow">Task Controls</p>
          <h2>Search and segment your work</h2>
        </div>
        <button type="button" className="button button-ghost" onClick={onReset}>
          Clear filters
        </button>
      </div>

      <div className="filters-grid">
        <label>
          Search
          <input
            type="text"
            placeholder="Search title or description"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
          />
        </label>

        <label>
          Status
          <select value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
            <option value="">All statuses</option>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Due from
          <input
            type="date"
            value={filters.dueFrom}
            onChange={(event) => onChange('dueFrom', event.target.value)}
          />
        </label>

        <label>
          Due to
          <input
            type="date"
            value={filters.dueTo}
            onChange={(event) => onChange('dueTo', event.target.value)}
          />
        </label>

        <label>
          Sort by
          <select value={filters.sortBy} onChange={(event) => onChange('sortBy', event.target.value)}>
            <option value="createdAt">Created date</option>
            <option value="updatedAt">Last updated</option>
            <option value="dueDate">Due date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </label>

        <label>
          Order
          <select value={filters.order} onChange={(event) => onChange('order', event.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>
    </section>
  );
}
