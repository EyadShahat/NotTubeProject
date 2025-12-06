import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";

export default function SearchResults({ q = "" }) {
  const [term, setTerm] = React.useState(decodeURIComponent(q || ""));
  const { videos, refreshVideos } = useNotTube();

  React.useEffect(() => { refreshVideos(term); }, [term, refreshVideos]);

  const results = React.useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return [];
    return videos.filter(v =>
      (v.title || "").toLowerCase().includes(t) ||
      (v.channelName || v.channel || "").toLowerCase().includes(t) ||
      (v.description || "").toLowerCase().includes(t)
    );
  }, [term, videos]);

  const goSearch = () => {
    const t = term.trim();
    window.location.hash = t ? `#/search?q=${encodeURIComponent(t)}` : "#/home";
  };

  return (
    <ShellLayout>
      <style>{`
        .bar { position:sticky; top:0; z-index:2; background:#f9fafb; padding:10px 0 14px; }
        .searchLine { display:flex; gap:12px; }
        .searchWrap { flex:1; display:flex; align-items:center; background:#fff; border:1px solid #d1d5db; border-radius:999px; height:44px; overflow:hidden; }
        .inp { flex:1; height:100%; border:0; outline:none; background:transparent; padding:0 14px; font-size:15px; }
        .btn { height:44px; padding:0 16px; border-radius:999px; border:1px solid #d1d5db; background:#fff; font-weight:700; cursor:pointer; }
        .list { display:flex; flex-direction:column; gap:14px; margin-top:12px; }
        .item { display:grid; grid-template-columns: 320px 1fr; gap:12px; border:1px solid #e5e7eb; background:#fff; border-radius:12px; overflow:hidden; text-decoration:none; color:inherit; }
        .thumb { aspect-ratio:16/9; background:#d1d5db; overflow:hidden; border-radius:10px; }
        .thumbMedia { width:100%; height:100%; object-fit:cover; display:block; }
        .meta { padding:10px; }
        .ttl { font-weight:800; font-size:16px; margin-bottom:6px; line-height:1.25; }
        .by { color:#6b7280; font-size:12.5px; }
        .desc { color:#374151; font-size:13px; margin-top:6px; line-height:1.3; }
        @media (max-width: 900px){ .item { grid-template-columns: 1fr; } }
        .empty { padding:24px; border:1px dashed #e5e7eb; border-radius:12px; background:#fff; }
      `}</style>

      <div className="bar">
        <div className="searchLine">
          <div className="searchWrap" role="search">
            <input
              className="inp"
              value={term}
              onChange={(e)=>setTerm(e.target.value)}
              placeholder="Search"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  goSearch();
                }
              }}
            />
            <button className="btn" type="button" onClick={goSearch}>Search</button>
          </div>
        </div>
      </div>

      {term.trim() && results.length === 0 && (
        <div className="empty">No results for <strong>{term}</strong>.</div>
      )}

      <div className="list">
        {results.map(v => (
          <a key={v.id} href={`#/video/${v.id}`} className="item">
            <div className="thumb">
              {v.thumb ? (
                <img className="thumbMedia" src={v.thumb} alt="" />
              ) : (
                <video className="thumbMedia" src={v.src} muted playsInline preload="metadata" />
              )}
            </div>
            <div className="meta">
              <div className="ttl">{v.title}</div>
              <div className="by">
                {v.channelName || v.channel} • {v.views || 0} views
              </div>
              {v.description && <div className="desc">{v.description}</div>}
            </div>
          </a>
        ))}
      </div>
    </ShellLayout>
  );
}
