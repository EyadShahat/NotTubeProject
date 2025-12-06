import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";
import { AVATARS } from "../data/avatars.js";

export default function ProfileSettings() {
  const { user, updateProfile } = useNotTube();
  const [displayName, setDisplayName] = React.useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || "");
  const [bio, setBio] = React.useState(user?.bio || "");
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState(null);

  React.useEffect(() => {
    setDisplayName(user?.name || "");
    setAvatarUrl(user?.avatarUrl || "");
    setBio(user?.bio || "");
  }, [user?.name]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name: displayName.trim() || user.name, avatarUrl: avatarUrl.trim(), bio });
    setSaving(false);
    setSavedAt(new Date());
  }

  return (
    <ShellLayout active="profile">
      <style>{`
        .card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:16px; }
        .grid { display:grid; grid-template-columns: 1fr 320px; gap:18px; align-items:start; }
        .field { display:flex; flex-direction:column; gap:6px; }
        .label { font-size:13px; font-weight:600; color:#374151; }
        .input, .textarea {
          width:100%; height:44px; border:1px solid #d1d5db; border-radius:10px; padding:0 12px; font-size:14px; outline:none;
        }
        .textarea { height:auto; min-height:88px; padding:10px 12px; resize:vertical; }
        .btn { height:44px; border-radius:12px; border:1px solid transparent; background:#111827; color:#fff; font-weight:700; cursor:pointer; }
        .btn[disabled]{ background:#cbd5e1; cursor:not-allowed; }
        .muted { color:#6b7280; font-size:12px; }
        .row { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
        .avatar { width:88px; height:88px; border-radius:999px; background:#e5e7eb center/cover no-repeat; border:1px solid #e5e7eb; }
        .stack { display:flex; gap:12px; align-items:center; }
        @media (max-width: 900px){ .grid{ grid-template-columns: 1fr; } }
      `}</style>

      <h2 style={{margin:"0 0 12px"}}>Profile settings</h2>

      <form className="grid" onSubmit={handleSave}>
        {/* left column */}
        <section className="card">
          <div className="stack" style={{marginBottom:14}}>
            <div className="avatar" style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined} />
            <div>
              <div style={{fontWeight:700}}>Profile photo</div>
              <div className="muted">(Mock) Avatar preview only</div>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label className="label" htmlFor="displayName">Display name</label>
              <input id="displayName" className="input" value={displayName}
                     onChange={(e)=>setDisplayName(e.target.value)} placeholder="Your name"/>
            </div>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input id="email" className="input" value={user?.email || ""} disabled />
            </div>
          </div>

          <div className="field" style={{marginTop:12}}>
            <label className="label">Choose an avatar</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(80px, 1fr))", gap:10 }}>
              {AVATARS.map((url) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => setAvatarUrl(url)}
                  style={{
                    border: avatarUrl === url ? "2px solid #111827" : "1px solid #d1d5db",
                    borderRadius: 10,
                    padding: 6,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width:"100%", aspectRatio:"1/1", borderRadius:8, background:`url(${url}) center/cover no-repeat` }} />
                </button>
              ))}
            </div>
          </div>

          <div className="field" style={{marginTop:12}}>
            <label className="label" htmlFor="bio">Bio</label>
            <textarea id="bio" className="textarea" value={bio}
                      onChange={(e)=>setBio(e.target.value)} placeholder="Tell people about yourself"/>
          </div>
        </section>

        {/* right column */}
        <aside className="card">
          <div className="muted">Password changes are not wired in this demo.</div>

          <div style={{height:12}} />

          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
          {savedAt && (
            <div className="muted" style={{marginTop:8}}>
              Saved at {savedAt.toLocaleTimeString()}
            </div>
          )}
        </aside>
      </form>
    </ShellLayout>
  );
}
