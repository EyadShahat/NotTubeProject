import React from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";

export default function FlagComment() {
  const [url, setUrl] = React.useState("");
  const [code, setCode] = React.useState("Copy Right");
  const [comment, setComment] = React.useState("");
  const [status, setStatus] = React.useState("");
  const { createFlag } = useNotTube();

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    createFlag({
      type: "comment",
      targetId: url.trim(),
      reason: code.trim() || "Unspecified",
      message: comment.trim(),
    })
      .then(() => {
        setStatus("Flag submitted");
        setUrl("");
        setCode("Copy Right");
        setComment("");
      })
      .catch((err) => setStatus(err.message || "Failed to submit flag"));
  }

  return (
    <AdminLayout active="flag-comment">
      <h2 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 700 }}>Flag Comment</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }} htmlFor="comment-url">
            comment url
          </label>
          <input
            id="comment-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="www.NoTube.com/videos?id=xxx#comment"
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              fontSize: 14,
            }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }} htmlFor="violation-code">
            violation code
          </label>
          <input
            id="violation-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Copy Right"
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              fontSize: 14,
            }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }} htmlFor="comment">
            comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here…"
            style={{
              width: "100%",
              minHeight: 100,
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              fontSize: 14,
              resize: "vertical",
            }}
          />
        </div>
        {status && <div style={{ marginBottom: 12, color: status.includes("Failed") ? "#b91c1c" : "#065f46" }}>{status}</div>}
        <button
          type="submit"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "#3b82f6",
            color: "#fff",
            border: 0,
            borderRadius: 10,
            fontWeight: 600,
            cursor: "pointer",
          }}
          disabled={!url.trim()}
        >
          Submit flag
        </button>
      </form>
    </AdminLayout>
  );
}
