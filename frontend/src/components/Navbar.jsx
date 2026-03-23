export default function Navbar({ user, onCreateTask, onLogout, logoutLoading }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1>Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="topbar-copy">Keep your priorities visible and your deadlines under control.</p>
      </div>

      <div className="topbar-actions">
        <button type="button" className="button button-secondary" onClick={onCreateTask}>
          New Task
        </button>
        <button type="button" className="button button-primary" onClick={onLogout} disabled={logoutLoading}>
          {logoutLoading ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </header>
  );
}
