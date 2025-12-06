import React from "react";
import SidebarSubs from "./SidebarSubs.jsx"; // keep if you created it
import { useNotTube } from "../state/NotTubeState.jsx";

export default function ShellLayout({ active = "home", children }) {
  const { user, logout } = useNotTube();
  const isAdmin = user?.role === "admin";
  return (
    <div className="page">
      <style>{`
        :root { --line:#e5e7eb; --muted:#6b7280; }
        * { box-sizing:border-box; }
        html, body, #root, .page { height:100%; margin:0; }
        body { background:#f6f7f9; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#0b0b0b; }

        .shell { display:grid; grid-template-columns: 280px 1fr; min-height:100dvh; }
        .sidebar {
          position:sticky; top:0; align-self:start;
          background:#fff; border-right:1px solid var(--line);
          min-height:100dvh; padding:20px 16px; display:flex; flex-direction:column;
        }
        .main { min-width:0; padding: clamp(12px, 2.5vw, 24px); }

        .logoRow { display:flex; align-items:center; gap:10px; padding:4px 8px 18px; }
        .brand { font-size:22px; font-weight:800; letter-spacing:-.02em; }
        .nav { display:flex; flex-direction:column; gap:6px; }
        .nav a, .nav button {
          height:44px; border-radius:10px; display:flex; align-items:center; gap:10px;
          padding:0 12px; background:transparent; border:0; text-decoration:none; color:#0f172a; cursor:pointer;
        }
        .nav a:hover, .nav button:hover { background:#f3f4f6; }
        .nav a[aria-current="page"] { background:#eef2f7; font-weight:700; }

        .avatarSmall { width:32px; height:32px; border-radius:999px; background:#0f172a center/cover no-repeat; }

        @media (max-width: 900px) {
          .shell { grid-template-columns: 72px 1fr; }
          .brandText, .nav a span, .nav button span { display:none; }
        }
      `}</style>

      <div className="shell">
        <aside className="sidebar">
          <div className="logoRow">
            <LogoMark />
            <div className="brand brandText">NotTube</div>
          </div>

          <nav className="nav">
            <a href="#/home"    aria-current={active==="home"    ? "page" : undefined}><IconHome/>  <span>Home</span></a>
            <a href="#/liked"   aria-current={active==="liked"   ? "page" : undefined}><IconLike/>  <span>liked videos</span></a>
            <a href="#/saved"   aria-current={active==="saved"   ? "page" : undefined}><IconSave/>  <span>saved videos</span></a>
            <a href="#/watched" aria-current={active==="watched" ? "page" : undefined}><IconClock/> <span>watched videos</span></a>
            <a href="#/my-flags" aria-current={active==="my-flags" ? "page" : undefined}><IconFlag/> <span>My flags</span></a>
          </nav>

          <SidebarSubs />

          <div className="nav" style={{marginTop:"auto"}}>
            {/* NEW: Manage my videos */}
            <a href="#/manage" aria-current={active==="manage" ? "page" : undefined}><IconManage/> <span>Manage my videos</span></a>

            {isAdmin ? (
              <a href="#/admin" aria-current={active==="admin" ? "page" : undefined}><IconManage/> <span>Admin Panel</span></a>
            ) : (
              <a href="#/profile" aria-current={active==="profile" ? "page" : undefined}><IconSettings/> <span>profile setting</span></a>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px" }}>
              <div className="avatarSmall" style={user?.avatarUrl ? { backgroundImage:`url(${user.avatarUrl})` } : undefined} />
              <div className="brandText" style={{ fontWeight:700, fontSize:13 }}>{user?.name || "User"}</div>
            </div>
            <a href="#/login" onClick={(e) => { e.preventDefault(); logout(); window.location.hash="#/login"; }}><IconSignOut/> <span>Sign out</span></a>
          </div>
        </aside>

        <main className="main">{children}</main>
      </div>
    </div>
  );
}

/* Icons */
function LogoMark(props) {
  return (
    <svg {...props} viewBox="0 0 64 64" aria-hidden="true" style={{ height: 22, width: 22 }}>
      <rect x="6" y="18" width="38" height="28" rx="6" fill="currentColor"/>
      <polygon points="50,24 58,20 58,44 50,40" fill="currentColor"/>
      <polygon points="24,24 24,40 38,32" fill="white"/>
    </svg>
  );
}
function IconHome(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5"/><path d="M6 10v10h12V10"/></svg>)}
function IconLike(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 13.6 12 22 3.2 13.6a5.5 5.5 0 1 1 7.8-7.8l1 1 1-1a5.5 5.5 0 1 1 7.8 7.8Z"/></svg>)}
function IconSave(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>)}
function IconClock(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>)}
function IconSettings(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.76l.06.08a2 2 0 1 1-2.83 2.83l-.08-.06A1.6 1.6 0 0 0 15 19.4a1.6 1.6 0 0 0-1 .31 1.6 1.6 0 0 0-.8 1.29V21a2 2 0 1 1-4 0l.01-.09a1.6 1.6 0 0 0-.81-1.29 1.6 1.6 0 0 0-1-.31 1.6 1.6 0 0 0-1.76-.3l-.08.06a2 2 0 1 1-2.83-2.83l.06-.08A1.6 1.6 0 0 0 4.6 15c0-.37-.1-.73-.3-1.06a1.6 1.6 0 0 0-.31-1 1.6 1.6 0 0 0-1.29-.8H2.99a2 2 0 1 1 0-4h.09c.52 0 1.01-.28 1.29-.8.2-.33.3-.69.31-1.06a1.6 1.6 0 0 0 .31-1l-.06-.08A2 2 0 1 1 7.76 2.2l.08.06A1.6 1.6 0 0 0 9 2.6c.37 0 .73-.1 1.06-.3.33-.2.69-.3 1.06-.31h.09a2 2 0 1 1 4 0l-.01.09c0 .52.28 1.01.8 1.29.33.2.69.3 1.06.31.37 0 .73.1 1.06.3l.08-.06a2 2 0 1 1 2.83 2.83l-.06.08a1.6 1.6 0 0 0-.31 1c0 .37.1 .73.3 1.06.2.33.3.69.31 1.06 0 .37.1.73.3 1.06Z"/></svg>)}
function IconSignOut(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>)}
function IconManage(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h10M7 12h6"/></svg>)}
function IconFlag(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V5s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>)}
