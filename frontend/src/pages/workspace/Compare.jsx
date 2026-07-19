import { useState } from "react";
import { GitCompare, ArrowRight } from "lucide-react";
import { useDocumentsContext } from "../../context/DocumentsContext";
import { compareDocuments } from "../../services/api";
import { PageHeader, Card, Spinner, ErrorNotice, EmptyState } from "../../components/ui/Primitives";
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

export default function Compare() {
  const { documents } = useDocumentsContext();
  const [docA, setDocA] = useState("");
  const [docB, setDocB] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCompare() {
    if (!docA || !docB || docA === docB) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await compareDocuments(docA, docB);
      setResult(data);
    } catch (err) {
      setError(err.message || "Comparison failed.");
    } finally {
      setLoading(false);
    }
  }

  if (documents.length < 2) {
    return (
      <EmptyState
        icon={GitCompare}
        title="Need at least 2 documents"
        description="Upload a second PDF from the sidebar to compare it against another one."
      />
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Feature" title="Compare Two PDFs" description="Get a structured, AI-generated comparison between any two uploaded documents." />

      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select
            value={docA}
            onChange={(e) => setDocA(e.target.value)}
            className="w-full sm:flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-600/50"
          >
            <option value="">Select document A...</option>
            {documents.map((d) => <option key={d.doc_id} value={d.doc_id}>{d.filename}</option>)}
          </select>
          <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
          <select
            value={docB}
            onChange={(e) => setDocB(e.target.value)}
            className="w-full sm:flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-600/50"
          >
            <option value="">Select document B...</option>
            {documents.map((d) => <option key={d.doc_id} value={d.doc_id}>{d.filename}</option>)}
          </select>
        </div>
        <button
          onClick={handleCompare}
          disabled={!docA || !docB || docA === docB || loading}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition"
        >
          Compare Documents
        </button>
        {docA && docA === docB && (
          <p className="text-amber-400 text-sm mt-3">Choose two different documents.</p>
        )}
      </Card>

      {loading && <Spinner label="Comparing documents..." />}
      {error && <ErrorNotice message={error} />}

      {result && !loading && (
        <Card className="p-8">
          <MarkdownRenderer content={result.comparison} />
        </Card>
      )}
    </div>
  );
}
