import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";
import { apiRequest } from "../api/client.js";

export default function UploadPage() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [src, setSrc] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [fileUrl, setFileUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const { createVideo, user } = useNotTube();

  async function onSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    if (user?.accountStatus === "flagged") {
      setStatus("Your account is flagged and cannot upload until resolved.");
      return;
    }
    if (!t || (!src.trim() && !file)) {
      alert("Please enter a Title and provide a video (file or URL).");
      return;
    }
    setStatus("Uploading...");
    try {
      let videoUrl = src.trim();

      if (file) {
        const form = new FormData();
        form.append("file", file);
        const res = await apiRequest("/upload", { method: "POST", body: form });
        videoUrl = res.url;
      }

      const id = await createVideo({
        title: t,
        description: description.trim(),
        src: videoUrl,
      });
      setStatus("Saved");
      if (id) window.location.hash = `#/video/${id}`;
    } catch (err) {
      setStatus(err.message || "Upload failed");
    }
  }

  function handleFile(fileObj) {
    if (!fileObj) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const blobUrl = URL.createObjectURL(fileObj);
    setFile(fileObj);
    setFileUrl(blobUrl);
    setFileName(fileObj.name);
  }
  function onFileChange(e){ handleFile(e.target.files?.[0]); }
  function onDrop(e){ e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }
  function onDrag(e){ e.preventDefault(); }

  return (
    <ShellLayout>
      <style>{`
        .wrap { max-width: 900px; margin: 0 auto; background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px; }
        .h { font-size:28px; font-weight:900; margin-bottom:18px; letter-spacing:-.01em; }
        .row { display:grid; grid-template-columns: 160px 1fr; gap:10px; align-items:start; margin:10px 0; }
        .lab { font-weight:700; color:#111827; }
        .inp { height:44px; border:1px solid #d1d5db; border-radius:10px; padding:0 12px; outline:none; width:100%; font-size:15px; }
        .txt { min-height:110px; border:1px solid #d1d5db; border-radius:10px; padding:10px 12px; outline:none; width:100%; font-size:15px; resize:vertical; }
        .help { color:#6b7280; font-size:13px; margin-top:8px; }
        .btns { display:flex; gap:10px; margin-top:18px; }
        .btn { height:44px; padding:0 16px; border-radius:10px; border:1px solid #d1d5db; background:#fff; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
        .primary { background:#111827; color:#fff; border-color:#111827; }
        .status { color:#6b7280; font-size:13px; margin-top:6px; }
        .drop { border:2px dashed #cbd5e1; border-radius:10px; padding:16px; text-align:center; background:#f8fafc; }
        .pill { display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border:1px solid #d1d5db; border-radius:999px; background:#fff; font-size:13px; margin-top:8px; }
        .preview { margin-top:10px; border-radius:10px; overflow:hidden; }
      `}</style>

      <div className="wrap">
        <div className="h">Upload a video</div>

        <form onSubmit={onSubmit}>
          <div className="row">
            <label className="lab" htmlFor="title">Title</label>
            <input id="title" className="inp" value={title} onChange={e=>setTitle(e.target.value)} placeholder="My new video" />
          </div>

          <div className="row">
            <label className="lab" htmlFor="desc">Description</label>
            <textarea id="desc" className="txt" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Write a short description..." />
          </div>

          {/* Local file */}
          <div className="row">
            <div className="lab">Local file</div>
            <div className="drop" onDrop={onDrop} onDragOver={onDrag} onDragEnter={onDrag} onDragLeave={onDrag}>
              Drag & drop a video here, or{" "}
              <label style={{ textDecoration: "underline", cursor: "pointer" }}>
                browse
                <input type="file" accept="video/*" style={{ display: "none" }} onChange={onFileChange} />
              </label>
              {fileUrl && (
                <>
                  <div className="pill">Selected: {fileName}</div>
                  <div className="preview">
                    <video controls src={fileUrl} style={{ width: "100%", maxHeight: 240 }} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Or paste a URL */}
          <div className="row">
            <label className="lab" htmlFor="url">Video URL</label>
            <input id="url" className="inp" value={src} onChange={e=>setSrc(e.target.value)} placeholder="https://example.com/video.mp4" />
          </div>

          <div className="help">
            Uploading a file stores it in Supabase Storage; or paste a direct MP4 URL.
          </div>

          {status && <div className="status">{status}</div>}

          <div className="btns">
            <button type="submit" className="btn primary">Upload</button>
            <button type="button" className="btn" onClick={()=>window.location.hash="#/home"}>Cancel</button>
          </div>
        </form>
      </div>
    </ShellLayout>
  );
}
