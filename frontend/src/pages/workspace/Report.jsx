import { useState } from "react";
import { FileOutput, Download, Printer, Sparkles } from "lucide-react";
import { useDocumentsContext } from "../../context/DocumentsContext";
import { getReport } from "../../services/api";
import { PageHeader, Card, Spinner, ErrorNotice, EmptyState } from "../../components/ui/Primitives";
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

export default function Report() {
  const { activeDocId, activeDocument, documents } = useDocumentsContext();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!activeDocId) return;
    setLoading(true);
    setError("");
    setReport("");
    try {
      const data = await getReport(activeDocId);
      setReport(data.report);
    } catch (err) {
      setError(err.message || "Could not generate report.");
    } finally {
      setLoading(false);
    }
  }

  function downloadMarkdown() {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDocument?.filename || "report"}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (documents.length === 0) {
    return <EmptyState icon={FileOutput} title="No document selected" description="Upload a PDF to generate a formal report." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Feature"
        title="AI Report Generator"
        description={activeDocument ? `Formal engineering report for "${activeDocument.filename}"` : "Select a document"}
        actions={
          report && (
            <>
              <button onClick={downloadMarkdown} className="flex items-center gap-1.5 text-sm text-slate-300 bg-slate-900 border border-slate-800 hover:text-white px-4 py-2 rounded-xl transition">
                <Download className="w-3.5 h-3.5" /> .md
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition">
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>
            </>
          )
        }
      />

      {!report && !loading && (
        <Card className="p-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-600/30 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Generate a structured report</h3>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            ForgeAI will read the full document and produce a formal report with an overview, key findings,
            technical specifications, risks and recommendations - ready to export.
          </p>
          <button onClick={generate} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition">
            Generate Report
          </button>
        </Card>
      )}

      {loading && <Spinner label="Drafting your report..." />}
      {error && <ErrorNotice message={error} />}

      {report && !loading && (
        <Card className="p-8 print:border-0 print:bg-white print:text-black">
          <MarkdownRenderer content={report} />
        </Card>
      )}
    </div>
  );
}
