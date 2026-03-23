const STAT_CARDS = [
  { key: 'total', label: 'Total tasks' },
  { key: 'todo', label: 'To do' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'dueSoon', label: 'Due soon' },
  { key: 'overdue', label: 'Overdue' }
];

export default function StatsGrid({ stats, loading }) {
  return (
    <section className="stats-grid">
      {STAT_CARDS.map((card) => (
        <article key={card.key} className="stat-card">
          <span>{card.label}</span>
          <strong>{loading ? '...' : stats[card.key] || 0}</strong>
        </article>
      ))}
    </section>
  );
}
