import { NavLink } from "react-router-dom";
import {
  MessageSquare, Search, FileText, LayoutDashboard, Sigma,
  Network, GitCompare, FileOutput, Upload, Trash2, Loader2, FileStack,
} from "lucide-react";
import { useRef } from "react";
import { useDocumentsContext } from "../../context/DocumentsContext";

const NAV_ITEMS = [
  { to: "/workspace", end: true, icon: MessageSquare, label: "AI Chat" },
  { to: "/workspace/search", icon: Search, label: "Smart Search" },
  { to: "/workspace/summary", icon: FileText, label: "Executive Summary" },
  { to: "/workspace/dashboard", icon: LayoutDashboard, label: "Engineering Dashboard" },
  { to: "/workspace/formulas", icon: Sigma, label: "Formula Extractor" },
  { to: "/workspace/graph", icon: Network, label: "Knowledge Graph" },
  { to: "/workspace/compare", icon: GitCompare, label: "Compare PDFs" },
  { to: "/workspace/report", icon: FileOutput, label: "Report Generator" },
];

export default function Sidebar() {
  const fileInputRef = useRef(null);
  const {
    documents, activeDocId, setActiveDocId,
    addDocument, removeDocument, uploading,
  } = useDocumentsContext();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      await addDocument(file);
    } catch (err) {
      alert(err.message || "Upload failed.");
    }
  }

  return (
    <aside className="w-72 shrink-0 h-full bg-slate-950/80 border-r border-slate-800 flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            F
          </div>
          <span className="font-bold text-white text-lg tracking-tight">ForgeAI</span>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600/15 text-blue-300 border border-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/70 border border-transparent"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white text-sm font-semibold py-2.5 rounded-xl"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Processing..." : "Upload PDF"}
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf" hidden onChange={handleFile} />
      </div>

      <div className="flex-1 overflow-y-auto px-3 mt-4 pb-4">
        <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-2 mb-2">
          Documents
        </p>

        {documents.length === 0 && (
          <div className="flex flex-col items-center text-center gap-2 text-slate-500 text-sm py-8 px-2">
            <FileStack className="w-6 h-6" />
            <span>No documents yet. Upload a PDF to get started.</span>
          </div>
        )}

        <div className="space-y-1.5">
          {documents.map((doc) => (
            <button
              key={doc.doc_id}
              onClick={() => setActiveDocId(doc.doc_id)}
              className={`w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition border ${
                activeDocId === doc.doc_id
                  ? "bg-slate-800 border-slate-700"
                  : "border-transparent hover:bg-slate-900"
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 ${activeDocId === doc.doc_id ? "text-blue-400" : "text-slate-500"}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm truncate ${activeDocId === doc.doc_id ? "text-white" : "text-slate-300"}`}>
                  {doc.filename}
                </p>
                <p className="text-[11px] text-slate-500">{doc.pages} pages</p>
              </div>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Remove "${doc.filename}"?`)) removeDocument(doc.doc_id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
