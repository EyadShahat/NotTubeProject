import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";

export default function ManageVideos() {
  const { videos, user, updateVideo, deleteVideo, refreshVideos, loadMyFlags, flags, appealFlag } = useNotTube();
  const [filter, setFilter] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [appealDrafts, setAppealDrafts] = React.useState({});

  React.useEffect(() => { refreshVideos(); loadMyFlags(); }, [refreshVideos, loadMyFlags]);

  const myVideos = React.useMemo(
    () => videos.filter((v) => String(v.owner) === String(user?.id)),
    [videos, user?.id],
  );

  const list = React.useMemo(() => {
    const t = filter.trim().toLowerCase();
    if (!t) return myVideos;
    return myVideos.filter(v =>
      (v.title||"").toLowerCase().includes(t) ||
      (v.description||"").toLowerCase().includes(t)
    );
  }, [myVideos, filter]);

  const myFlags = React.useMemo(() => flags || [], [flags]);

  async function saveOne(id, fields) {
    if (user?.accountStatus === "flagged") {
      setStatus("Account flagged; cannot edit videos.");
      return;
    }
    setStatus("Saving...");
    await updateVideo(id, fields);
    setStatus("Saved");
  }
  async function removeOne(id) {
    if (user?.accountStatus === "flagged") {
      setStatus("Account flagged; cannot delete videos.");
      return;
    }
    if (!confirm("Delete this video? This also removes its comments.")) return;
    setStatus("Deleting...");
    await deleteVideo(id);
    setStatus("Deleted");
  }

  async function submitAppeal(flagId) {
    const msg = (appealDrafts[flagId] || "").trim();
    if (!msg) return;
    await appealFlag(flagId, msg);
    setAppealDrafts((prev) => ({ ...prev, [flagId]: "" }));
  }

  return (
    <ShellLayout active="manage">
      <style>{`
        .wrap { max-width: 980px; margin: 0 auto; }
        .h { font-size:28px; font-weight:900; letter-spacing:-.01em; margin-bottom:14px; }
        .bar { display:flex; gap:8px; margin-bottom:12px; }
        .inp { height:40px; border:1px solid #d1d5db; border-radius:10px; padding:0 12px; flex:1; }
        .card { border:1px solid #e5e7eb; background:#fff; border-radius:12px; padding:12px; margin-bottom:12px; }
        .row { display:grid; grid-template-columns: 160px 1fr; gap:10px; align-items:start; margin:6px 0; }
        .lab { font-weight:700; color:#111827; }
        .text { width:100%; height:40px; border:1px solid #d1d5db; border-radius:10px; padding:0 10px; }
        .area { width:100%; min-height:90px; border:1px solid #d1d5db; border-radius:10px; padding:10px; resize:vertical; }
        .btns { display:flex; gap:8px; margin-top:10px; }
        .btn { height:36px; padding:0 14px; border-radius:10px; border:1px solid #111827; background:#111827; color:#fff; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; text-decoration:none; }
        .danger { background:#fee2e2; border-color:#fecaca; color:#991b1b; }
        .pill { font-size:12px; color:#6b7280; }
        .flagCard { border:1px solid #e5e7eb; background:#fff; border-radius:12px; padding:12px; margin-bottom:10px; }
        .flagRow { display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; }
      `}</style>

      <div className="wrap">
        <div className="h">My flags</div>
        {myFlags.length === 0 && <div className="card">No flags on your content or account.</div>}
        {myFlags.map((f) => (
          <div key={f._id || f.id} className="flagCard">
            <div className="flagRow">
              <div>
                <div style={{ fontWeight:700 }}>Type: {f.type}</div>
                <div style={{ color:"#374151", fontSize:13 }}>Reason: {f.reason}</div>
                {f.message && <div style={{ color:"#6b7280", fontSize:12 }}>Note: {f.message}</div>}
                {f.appealMessage && <div style={{ color:"#0f172a", fontSize:12, marginTop:4 }}>Your appeal: {f.appealMessage}</div>}
                <div style={{ color:"#6b7280", fontSize:12 }}>Status: {f.status} {f.outcome ? `(${f.outcome})` : ""}</div>
              </div>
              <div style={{ minWidth:240, flex:"1 1 240px" }}>
                <input
                  type="text"
                  value={appealDrafts[f._id || f.id] || ""}
                  onChange={(e)=>setAppealDrafts((prev)=>({ ...prev, [f._id || f.id]: e.target.value }))}
                  placeholder="Add a message to appeal"
                  style={{ width:"100%", height:36, borderRadius:8, border:"1px solid #d1d5db", padding:"0 10px" }}
                />
                <button
                  type="button"
                  className="btn"
                  style={{ height:32, marginTop:6, padding:"0 12px" }}
                  onClick={()=>submitAppeal(f._id || f.id)}
                  disabled={user?.accountStatus === "flagged"}
                >
                  Submit message
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="h">Manage my videos</div>
        <div className="bar">
          <input className="inp" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search my uploads..." />
          <a className="btn" href="#/upload">Upload new</a>
        </div>
        {status && <div className="pill">{status}</div>}

        {list.length === 0 && <div className="card">No uploads yet.</div>}

        {list.map(v => (
          <VideoManageCard key={v.id} v={v} onSave={saveOne} onDelete={removeOne} />
        ))}
      </div>
    </ShellLayout>
  );
}

function VideoManageCard({ v, onSave, onDelete }) {
  const [title, setTitle] = React.useState(v.title);
  const [desc, setDesc]   = React.useState(v.description || "");
  const [url, setUrl]     = React.useState(v.src || "");

  function save(){
    onSave(v.id, { title, description:desc, src:url });
  }

  return (
    <div className="card">
      <div className="row"><div className="lab">Video ID</div><div className="pill">{v.id}</div></div>
      <div className="row"><div className="lab">Title</div><input className="text" value={title} onChange={e=>setTitle(e.target.value)} /></div>
      <div className="row"><div className="lab">Description</div><textarea className="area" value={desc} onChange={e=>setDesc(e.target.value)} /></div>
      <div className="row"><div className="lab">Video URL</div><input className="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." /></div>

      <div className="btns">
        <button className="btn" onClick={save}>Save changes</button>
        <button className="btn danger" onClick={()=>onDelete(v.id)}>Delete video</button>
        <a className="btn" href={`#/video/${v.id}`}>Open</a>
      </div>
    </div>
  );
}
