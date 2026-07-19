import { useEffect, useState } from "react";
import { Sigma } from "lucide-react";
import { useDocumentsContext } from "../../context/DocumentsContext";
import { getFormulas } from "../../services/api";
import { PageHeader, Card, Spinner, ErrorNotice, EmptyState } from "../../components/ui/Primitives";
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

export default function Formulas() {
  const { activeDocId, activeDocument, documents } = useDocumentsContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeDocId) return;
    setLoading(true);
    setError("");
    setData(null);
    getFormulas(activeDocId)
      .then(setData)
      .catch((err) => setError(err.message || "Could not extract formulas."))
      .finally(() => setLoading(false));
  }, [activeDocId]);

  if (documents.length === 0) {
    return <EmptyState icon={Sigma} title="No document selected" description="Upload a PDF to extract its formulas." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Feature"
        title="Formula Extractor"
        description={activeDocument ? `Equations and formulas found in "${activeDocument.filename}"` : "Select a document"}
      />

      {loading && <Spinner label="Scanning for formulas..." />}
      {error && <ErrorNotice message={error} />}

      {data && !loading && (
        <div className="space-y-6">
          {data.formulas.length === 0 ? (
            <EmptyState title="No formulas detected" description="This document doesn't appear to contain recognizable equations." />
          ) : (
            <>
              <Card className="p-6">
                <h3 className="font-semibold text-white mb-4">Raw formulas found ({data.formulas.length})</h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {data.formulas.map((f, i) => (
                    <code key={i} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-emerald-300 font-mono overflow-x-auto">
                      {f}
                    </code>
                  ))}
                </div>
              </Card>

              {data.explanation && (
                <Card className="p-8">
                  <h3 className="font-semibold text-white mb-4">AI Explanations</h3>
                  <MarkdownRenderer content={data.explanation} />
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
