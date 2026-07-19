import { Link } from "react-router-dom";
import { ChevronDown, Home, WifiOff } from "lucide-react";
import { useState } from "react";
import { useDocumentsContext } from "../../context/DocumentsContext";

export default function Topbar() {
  const { documents, activeDocId, setActiveDocId, activeDocument, error } = useDocumentsContext();
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 shrink-0 border-b border-slate-800 bg-slate-950/60 backdrop-blur flex items-center justify-between px-6 gap-4">
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          disabled={documents.length === 0}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-50 rounded-xl px-4 py-2 text-sm text-slate-200 min-w-[220px] max-w-[360px] justify-between"
        >
          <span className="truncate">
            {activeDocument ? activeDocument.filename : "No document selected"}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        </button>

        {open && documents.length > 0 && (
          <div className="absolute mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-20 max-h-72 overflow-y-auto">
            {documents.map((doc) => (
              <button
                key={doc.doc_id}
                onClick={() => {
                  setActiveDocId(doc.doc_id);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm truncate hover:bg-slate-800 ${
                  doc.doc_id === activeDocId ? "text-blue-300 bg-slate-800/60" : "text-slate-300"
                }`}
              >
                {doc.filename}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {error && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-red-400">
            <WifiOff className="w-3.5 h-3.5" /> Backend unreachable
          </span>
        )}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition"
        >
          <Home className="w-4 h-4" /> Landing page
        </Link>
      </div>
    </header>
  );
}
