import React from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";

export default function ManageAppeals() {
  const { flags, loadFlags, loadMyFlags, updateFlag, appealFlag, user } = useNotTube();
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [appealMessage, setAppealMessage] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(null);

  const isAdmin = user?.role === "admin";

  React.useEffect(() => {
    if (isAdmin) loadFlags();
    else loadMyFlags();
  }, [isAdmin, loadFlags, loadMyFlags]);

  const appeals = React.useMemo(() => (flags || []).map((f) => ({
    id: f._id || f.id,
    type: f.type,
    user: f.createdBy || "User",
    date: new Date(f.createdAt || Date.now()).toLocaleDateString(),
    reason: f.reason,
    message: f.message,
    appealMessage: f.appealMessage,
    status: f.status,
    outcome: f.outcome || "pending",
  })), [flags]);

  //filter appeals by query across id, user and reason
  const filtered = appeals.filter((a) => {
    const q = query.toLowerCase();
    const matchesQuery = (
      a.id.toLowerCase().includes(q) ||
      a.user.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q)
    );
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleStatusChange = (id, status) => {
    updateFlag(id, { status }).catch(() => {});
  };

  const handleOutcome = (id, outcome) => {
    updateFlag(id, { status: "resolved", outcome }).catch(() => {});
  };

  const handleAppeal = (e) => {
    e.preventDefault();
    if (!selectedId || !appealMessage.trim()) return;
    appealFlag(selectedId, appealMessage.trim())
      .then(() => {
        setAppealMessage("");
        setSelectedId(null);
      })
      .catch(() => {});
  };

  return (
    <AdminLayout active="manage">
      <h2 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 700 }}>Manage Appeals</h2>
      <div style={{ marginBottom: 12, display:"flex", gap:8 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          aria-label="Search appeals"
          style={{
            width: 280,
            height: 40,
            border: "1px solid #d1d5db",
            borderRadius: 8,
            padding: "0 12px",
            fontSize: 14,
          }}
        />
        <select
          value={statusFilter}
          onChange={(e)=>setStatusFilter(e.target.value)}
          style={{ height:40, borderRadius:8, border:"1px solid #d1d5db", padding:"0 10px" }}
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            minWidth: 600,
          }}
        >
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {[
                "Flag ID",
                "Type",
                "Created",
                "Reason",
                "Status",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: 16, textAlign: "center", color: "#6b7280", fontSize: 14 }}
                >
                  No appeals found.
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const statuses = ["open", "in_review", "resolved"];
                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px", fontWeight: 600 }}>{a.id}</td>
                    <td style={{ padding: "12px" }}>{a.type}</td>
                    <td style={{ padding: "12px" }}>{a.date}</td>
                    <td style={{ padding: "12px" }}>
                      <div>{a.reason}</div>
                      {a.message && <div style={{ color:"#6b7280", fontSize:12 }}>{a.message}</div>}
                      {a.appealMessage && <div style={{ color:"#0f172a", fontSize:12, marginTop:4 }}>Appeal: {a.appealMessage}</div>}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <StatusBadge status={a.status} outcome={a.outcome} />
                      <div style={{ marginTop:6, display:"flex", gap:6, flexWrap:"wrap" }}>
                        {isAdmin ? (
                          <>
                            <select
                              value={a.status}
                              onChange={(e)=>handleStatusChange(a.id, e.target.value)}
                              style={{ height:32, borderRadius:8, border:"1px solid #d1d5db", padding:"0 8px" }}
                            >
                              {statuses.map((s)=><option key={s} value={s}>{s}</option>)}
                            </select>
                            <button
                              type="button"
                              onClick={()=>handleOutcome(a.id, "accepted")}
                              style={{ border:"1px solid #d1d5db", borderRadius:8, padding:"4px 10px", background:"#e0f2fe", cursor:"pointer" }}
                            >
                              Resolve (accept)
                            </button>
                            <button
                              type="button"
                              onClick={()=>handleOutcome(a.id, "denied")}
                              style={{ border:"1px solid #d1d5db", borderRadius:8, padding:"4px 10px", background:"#fee2e2", cursor:"pointer" }}
                            >
                              Resolve (deny)
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={()=>setSelectedId(a.id)}
                            style={{ border:"1px solid #d1d5db", borderRadius:8, padding:"4px 10px", background:"#e0f2fe", cursor:"pointer" }}
                          >
                            Appeal
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isAdmin && (
        <form onSubmit={handleAppeal} style={{ marginTop:16 }}>
          <h4 style={{ margin: "0 0 8px" }}>Respond to a flag</h4>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start", flexWrap:"wrap" }}>
            <select
              value={selectedId || ""}
              onChange={(e)=>setSelectedId(e.target.value)}
              style={{ height:40, borderRadius:8, border:"1px solid #d1d5db", padding:"0 10px", minWidth:200 }}
              required
            >
              <option value="">Select flag</option>
              {appeals.map(a => <option key={a.id} value={a.id}>{a.id} - {a.reason}</option>)}
            </select>
            <input
              type="text"
              value={appealMessage}
              onChange={(e)=>setAppealMessage(e.target.value)}
              placeholder="Your appeal message"
              style={{ flex:"1 1 260px", height:40, borderRadius:8, border:"1px solid #d1d5db", padding:"0 12px" }}
              required
            />
            <button type="submit" style={{ height:40, padding:"0 14px", borderRadius:8, border:"1px solid #111827", background:"#111827", color:"#fff", cursor:"pointer" }}>
              Submit appeal
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}


function StatusBadge({ status, outcome }) {
  let bg = "#e5e7eb";
  let fg = "#374151";
  if (status === "Pending") {
    bg = "#d1fae5";
    fg = "#065f46";
  } else if (status === "Approved") {
    bg = "#dbeafe";
    fg = "#1e40af";
  } else if (status === "Rejected") {
    bg = "#fee2e2";
    fg = "#b91c1c";
  }
  const label = outcome && status === "resolved"
    ? `Resolved (${outcome})`
    : status;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color: fg,
      }}
    >
      {label}
    </span>
  );
}
