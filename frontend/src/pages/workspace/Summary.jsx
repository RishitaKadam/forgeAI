import { useEffect, useState } from "react";
import { FileText, Download, RefreshCw } from "lucide-react";
import { useDocumentsContext } from "../../context/DocumentsContext";
import { getSummary } from "../../services/api";
import { PageHeader, Card, Spinner, ErrorNotice, EmptyState } from "../../components/ui/Primitives";
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

export default function Summary() {
  const { activeDocId, activeDocument, documents } = useDocumentsContext();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!activeDocId) return;
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const data = await getSummary(activeDocId);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "Could not generate summary.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [activeDocId]); // eslint-disable-line react-hooks/exhaustive-deps

  function download() {
    const blob = new Blob([summary], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDocument?.filename || "summary"}-summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (documents.length === 0) {
    return <EmptyState icon={FileText} title="No document selected" description="Upload a PDF to generate an executive summary." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Feature"
        title="AI Executive Summary"
        description={activeDocument ? `Summary of "${activeDocument.filename}"` : "Select a document"}
        actions={
          <>
            <button onClick={load} className="flex items-center gap-1.5 text-sm text-slate-300 bg-slate-900 border border-slate-800 hover:text-white px-4 py-2 rounded-xl transition">
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
            {summary && (
              <button onClick={download} className="flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            )}
          </>
        }
      />

      {loading && <Spinner label="ForgeAI is reading the document..." />}
      {error && <ErrorNotice message={error} />}
      {summary && !loading && (
        <Card className="p-8">
          <MarkdownRenderer content={summary} />
        </Card>
      )}
    </div>
  );
}
