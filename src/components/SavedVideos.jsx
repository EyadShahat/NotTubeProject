import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";

export default function SavedVideos() {
  const { savedIds, videos } = useNotTube();
  const items = videos.filter((v) => savedIds.includes(String(v.id)));

  return (
    <ShellLayout active="saved">
      <style>{`
        .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:16px; }
        .card { text-decoration:none; color:inherit; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background:#fff; }
        .thumb { aspect-ratio:16/9; background:#d1d5db; overflow:hidden; }
        .thumbMedia { width:100%; height:100%; object-fit:cover; display:block; }
        .title { padding:10px; font-weight:700; font-size:14px; }
        .empty { color:#6b7280; }
      `}</style>

      <h2 style={{margin:"0 0 12px"}}>Saved videos</h2>
      {items.length === 0 ? (
        <div className="empty">No saved videos yet.</div>
      ) : (
        <div className="grid">
          {items.map(v=>(
            <a key={v.id} href={`#/video/${v.id}`} className="card">
              <div className="thumb">
                {v.thumb ? (
                  <img className="thumbMedia" src={v.thumb} alt="" />
                ) : (
                  <video className="thumbMedia" src={v.src} muted playsInline preload="metadata" />
                )}
              </div>
              <div className="title">{v.title}</div>
            </a>
          ))}
        </div>
      )}
    </ShellLayout>
  );
}
