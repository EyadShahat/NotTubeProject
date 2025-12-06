import React from "react";
import { useNotTube } from "../state/NotTubeState.jsx";
import { AVATARS } from "../data/avatars.js";

export default function NotTubeSignup() {
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState(AVATARS[0]);
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState("");
  const { signup } = useNotTube();

  const canSubmit = email.trim() && username.trim() && password.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");

    try {
      await signup({ email: email.trim(), password: password.trim(), name: username.trim(), avatarUrl });
      window.location.hash = "#/home";
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <div className="page">
      <style>{`
        :root { --fg:#0b0b0b; --muted:#6b7280; --line:#e5e7eb; --bg:#ffffff; --accent:#111827; }
        * { box-sizing: border-box; }
        html, body, #root { height: 100%; background: #fff; }

        .page { min-height: 100vh; color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }

        .topbar {
          position: sticky; top: 0; z-index: 5;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px; background: #fff; position: relative;
        }
        .topbar::after { content:""; position:absolute; left:0; bottom:0; width:100vw; border-bottom:2px solid var(--line); }
        .topbtn, .toplink {
          color:#3f3f46; background:none; border:0; padding:0; font:inherit; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px; text-decoration:none;
        }
        .topbtn:hover, .toplink:hover { color:#111827; }

        .stage {
          max-width: 1440px; margin: 0 auto;
          min-height: calc(100vh - 56px);
          padding: clamp(16px, 4vw, 48px);
          display: flex; align-items: center; justify-content: center;
        }

        .stack { display:flex; flex-direction:column; gap: clamp(12px, 2.5vw, 20px); width:100%; max-width: 820px; }

        .logoRow { display:flex; justify-content:center; align-items:center; gap:10px; }
        .brand { font-size: clamp(28px, 3.2vw, 40px); font-weight:700; letter-spacing:-0.02em; position:relative; }
        .brand::after { content:""; position:absolute; left:0; right:0; bottom:-8px; height:2px; background:#111; opacity:.25; }

        .card {
          display:flex; flex-direction:column;
          border:1px solid #e6e6e6; border-radius:18px; background:#fff;
          padding: clamp(18px, 3.6vw, 28px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.03);
        }
        .title { text-align:center; font-size: clamp(22px, 2.6vw, 28px); font-weight:700; margin-top: 4px; }
        .subtitle { text-align:center; color:#6b7280; font-size:13px; margin-top:6px; line-height:1.35; }

        .form { margin-top: clamp(16px, 3vw, 24px); display:grid; gap:14px; }
        .label { font-size:13px; font-weight:600; color:#3f3f46; }
        .input {
          width:100%; height:48px; border:1px solid #d4d4d8; border-radius:10px;
          padding:0 14px; outline:none; background:#fff; color:#0a0a0a; font-size:15px;
        }
        .input:focus { box-shadow:0 0 0 6px #eef0f2; }

        .inline { display:flex; align-items:center; justify-content:space-between; }

        .rules { display:flex; flex-wrap:wrap; gap:10px 20px; color:#6b7280; font-size:12.5px; margin-top:8px; line-height:1.2; }
        .dot { width:6px; height:6px; border-radius:999px; background:#9ca3af; display:inline-block; margin-right:8px; transform:translateY(-1px); }

        .actions { margin-top: clamp(10px, 2.2vw, 18px); }
        .btn {
          width:100%; height:48px; border-radius:18px; font-weight:700; font-size:16px;
          border:1px solid transparent; background:#0b0b0b; color:#fff;
        }
        .btn:disabled { background:#d1d5db; color:#fff; cursor:not-allowed; }
      `}</style>

      <header className="topbar">
        <a className="topbtn" href="#/login" aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </a>
      </header>

      <div className="stage">
        <div className="stack">
          <div className="logoRow">
            <LogoMark />
            <div className="brand">NotTube</div>
          </div>

          <section className="card">
            <h2 className="title">Create an account</h2>
            <p className="subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis maximus.
            </p>
            {error && <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}

            <form className="form" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" className="input" type="email" value={email}
                       onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>

              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" className="input" type="tel" value={phone}
                       onChange={(e)=>setPhone(e.target.value)} placeholder="(555) 555-5555" />
                <div style={{color:"#6b7280", fontSize:12, marginTop:6}}>
                  We strongly recommend adding a phone number. This will help verify your account and keep it safe.
                </div>
              </div>

              <div>
                <label className="label" htmlFor="username">Username</label>
                <input id="username" className="input" value={username}
                       onChange={(e)=>setUsername(e.target.value)} placeholder="yourname" required />
              </div>

              <div>
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

              <div>
                <div className="inline">
                  <label className="label" htmlFor="password">Password</label>
                  <button type="button" className="toplink" onClick={()=>setShowPw(s=>!s)}>
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
                <input id="password" className="input" type={showPw ? "text" : "password"} value={password}
                       onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required />

                <div className="rules">
                  <div><span className="dot" />Use 8 or more characters</div>
                  <div><span className="dot" />Use upper and lower case letters (e.g., Aa)</div>
                  <div><span className="dot" />Use a number (e.g., 1234)</div>
                  <div><span className="dot" />Use a symbol (e.g., !@#$)</div>
                </div>
              </div>

              <div className="actions">
                <button className="btn" type="submit" disabled={!canSubmit}>Sign up</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

/* icon */
function LogoMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ height: 36, width: 36 }}>
      <rect x="6" y="18" width="38" height="28" rx="6" fill="currentColor"/>
      <polygon points="50,24 58,20 58,44 50,40" fill="currentColor"/>
      <polygon points="24,24 24,40 38,32" fill="white"/>
    </svg>
  );
}
