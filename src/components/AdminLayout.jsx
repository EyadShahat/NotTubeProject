import React from "react";

export default function AdminLayout({ active = "manage", children }) {
  return (
    <div className="admin-page">
      <style>{`
        :root {
        /* match global variables used elsewhere */
        --fg: #0b0b0b;
        --muted: #6b7280;
        --line: #e5e7eb;
          }

          .admin-page {
            /* use the same font stack and base text colour as the rest of the app */
            color: var(--fg);
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
            background: #f6f7f9;
          }
        * { box-sizing: border-box; }
        html, body, #root { height:100%; margin:0; }
        .topbar {
          display:flex;
          align-items:center;
          gap:8px;
          padding:12px 16px;
          background:#fff;
          border-bottom:1px solid #e5e7eb;
          position:sticky;
          top:0;
          z-index:3;
        }
        .topbar a {
          display:inline-flex;
          align-items:center;
          gap:4px;
          text-decoration:none;
          color:#111827;
          font-weight:600;
          font-size:14px;
        }
        .topbar a:hover { color:#0b0b0b; }
        .admin-shell {
          display:grid;
          grid-template-columns: 200px 1fr;
          min-height:calc(100vh - 48px);
        }
        .admin-sidebar {
          background:#fff;
          border-right:1px solid #e5e7eb;
          padding:16px;
          display:flex;
          flex-direction:column;
          gap:8px;
        }
        .admin-nav {
          display:flex;
          flex-direction:column;
          gap:6px;
        }
        .admin-nav a {
          display:flex;
          align-items:center;
          gap:8px;
          padding:8px 10px;
          border-radius:8px;
          text-decoration:none;
          color:#111827;
          font-size:14px;
        }
        .admin-nav a:hover { background:#f3f4f6; }
        .admin-nav a[aria-current="page"] {
          background:#eef2f7;
          font-weight:700;
        }
        .admin-main {
          padding:20px 24px;
          background:#f6f7f9;
          min-width:0;
        }
        @media(max-width:900px){
          .admin-shell { grid-template-columns: 72px 1fr; }
          .admin-nav a span { display:none; }
        }
      `}</style>
      <header className="topbar">
        <a href="#/home" aria-label="Return to home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Home
        </a>
        <div style={{ flex: 1 }} />
        <LogoMark />
        <span style={{ fontWeight: 800, fontSize: 18, marginLeft: 4 }}>NotTube</span>
      </header>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <a href="#/admin" aria-current={active === "manage" ? "page" : undefined}><span>manage appeals</span></a>
            <a href="#/admin/flag-video" aria-current={active === "flag-video" ? "page" : undefined}><span>flag video</span></a>
            <a href="#/admin/flag-account" aria-current={active === "flag-account" ? "page" : undefined}><span>flag account</span></a>
            <a href="#/admin/flag-comment" aria-current={active === "flag-comment" ? "page" : undefined}><span>comment</span></a>
          </nav>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}

/*
 * Reuse the same logo mark used in the rest of the project. Duplicating
 * the icon here avoids the need for cross-file imports and keeps this
 * component self-contained. The icon matches the one defined in
 * ShellLayout.jsx.
 */
function LogoMark(props) {
  return (
    <svg {...props} viewBox="0 0 64 64" aria-hidden="true" style={{ height: 22, width: 22 }}>
      <rect x="6" y="18" width="38" height="28" rx="6" fill="currentColor" />
      <polygon points="50,24 58,20 58,44 50,40" fill="currentColor" />
      <polygon points="24,24 24,40 38,32" fill="white" />
    </svg>
  );
}
