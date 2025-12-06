import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";

export default function MyFlags() {
  const { flags, loadMyFlags, appealFlag, user } = useNotTube();
  const [appealDrafts, setAppealDrafts] = React.useState({});

  React.useEffect(() => {
    loadMyFlags();
  }, [loadMyFlags]);

  const submit = async (id) => {
    const msg = (appealDrafts[id] || "").trim();
    if (!msg) return;
    await appealFlag(id, msg);
    setAppealDrafts((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <ShellLayout active="my-flags">
      <style>{`
        .wrap { max-width: 900px; margin:0 auto; display:flex; flex-direction:column; gap:12px; }
        .card { border:1px solid #e5e7eb; background:#fff; border-radius:12px; padding:12px; }
        .row { display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; }
        .meta { color:#6b7280; font-size:12px; }
        .btn { height:32px; padding:0 12px; border-radius:8px; border:1px solid #111827; background:#111827; color:#fff; font-weight:700; cursor:pointer; }
      `}</style>
      <div className="wrap">
        <h2 style={{ margin:"0 0 8px" }}>My flags</h2>
        {flags.length === 0 && <div className="card">No flags on your account or content.</div>}
        {flags.map((f) => (
          <div key={f._id || f.id} className="card">
            <div className="row">
              <div>
                <div style={{ fontWeight:700 }}>{f.type}</div>
                <div className="meta">Status: {f.status} {f.outcome ? `(${f.outcome})` : ""}</div>
                <div style={{ marginTop:6 }}>{f.reason}</div>
                {f.message && <div className="meta" style={{ marginTop:4 }}>Note: {f.message}</div>}
                {f.appealMessage && <div className="meta" style={{ marginTop:4 }}>Your appeal: {f.appealMessage}</div>}
              </div>
              <div style={{ minWidth:240, flex:"1 1 240px" }}>
                <input
                  type="text"
                  value={appealDrafts[f._id || f.id] || ""}
                  onChange={(e)=>setAppealDrafts((prev)=>({ ...prev, [f._id || f.id]: e.target.value }))}
                  placeholder="Add a message to appeal"
                  style={{ width:"100%", height:32, borderRadius:8, border:"1px solid #d1d5db", padding:"0 10px" }}
                  disabled={!!f.appealMessage}
                />
                <button
                  className="btn"
                  style={{ marginTop:6 }}
                  onClick={()=>submit(f._id || f.id)}
                  disabled={user?.accountStatus === "flagged" || !!f.appealMessage}
                >
                  Submit message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ShellLayout>
  );
}
