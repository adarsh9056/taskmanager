export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <main className="auth-shell">
      <section className="auth-showcase">
        <p className="eyebrow">TaskFlow</p>
        <h1>Run your work with clarity, not clutter.</h1>
        <p className="showcase-copy">
          A clean full-stack task manager with secure authentication, fast filtering, and
          deployment-ready architecture.
        </p>
        <div className="showcase-grid">
          <article className="showcase-card">
            <span>JWT Sessions</span>
            <strong>Access + refresh tokens with rotation</strong>
          </article>
          <article className="showcase-card">
            <span>Focused Planning</span>
            <strong>Search, status filters, due dates, and pagination</strong>
          </article>
          <article className="showcase-card">
            <span>Ready To Ship</span>
            <strong>Render, Railway, Vercel, and MongoDB Atlas friendly</strong>
          </article>
        </div>
      </section>

      <section className="auth-panel">
        <div className="panel-header">
          <p className="eyebrow">Welcome</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {children}
        <div className="auth-footer">{footer}</div>
      </section>
    </main>
  );
}
