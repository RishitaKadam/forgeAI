import { useEffect, useState } from "react";
import { LayoutDashboard, BookOpen, Hash, Clock, Layers } from "lucide-react";
import { useDocumentsContext } from "../../context/DocumentsContext";
import { getDashboard } from "../../services/api";
import { PageHeader, Card, Spinner, ErrorNotice, EmptyState } from "../../components/ui/Primitives";

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-600/30 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-slate-500 text-xs mt-1.5">{label}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { activeDocId, activeDocument, documents } = useDocumentsContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeDocId) return;
    setLoading(true);
    setError("");
    setData(null);
    getDashboard(activeDocId)
      .then(setData)
      .catch((err) => setError(err.message || "Could not load dashboard."))
      .finally(() => setLoading(false));
  }, [activeDocId]);

  if (documents.length === 0) {
    return <EmptyState icon={LayoutDashboard} title="No document selected" description="Upload a PDF to see its engineering dashboard." />;
  }

  const maxTermCount = data?.top_terms?.[0]?.count || 1;

  return (
    <div>
      <PageHeader
        eyebrow="Feature"
        title="Engineering Dashboard"
        description={activeDocument ? `Statistics and key data extracted from "${activeDocument.filename}"` : "Select a document"}
      />

      {loading && <Spinner label="Analyzing document..." />}
      {error && <ErrorNotice message={error} />}

      {data && !loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={BookOpen} label="Pages" value={data.pages} />
            <StatCard icon={Hash} label="Words" value={data.words.toLocaleString()} />
            <StatCard icon={Clock} label="Reading time" value={`${data.reading_minutes} min`} />
            <StatCard icon={Layers} label="Sections detected" value={data.sections.length} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-white mb-4">Top Terms</h3>
              {data.top_terms.length === 0 && <p className="text-slate-500 text-sm">Not enough text to analyze.</p>}
              <div className="space-y-2.5">
                {data.top_terms.map((t) => (
                  <div key={t.term} className="flex items-center gap-3">
                    <span className="text-sm text-slate-300 w-24 truncate capitalize">{t.term}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                        style={{ width: `${(t.count / maxTermCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-6 text-right">{t.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-white mb-4">Key Values &amp; Specs</h3>
              {data.key_values.length === 0 && <p className="text-slate-500 text-sm">No numeric specifications detected.</p>}
              <div className="flex flex-wrap gap-2">
                {data.key_values.map((v) => (
                  <span key={v.value} className="text-sm bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg">
                    {v.value} <span className="text-slate-500">×{v.count}</span>
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Detected Sections</h3>
            {data.sections.length === 0 ? (
              <p className="text-slate-500 text-sm">No numbered section headings detected in this document.</p>
            ) : (
              <ol className="space-y-2">
                {data.sections.map((s, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-3">
                    <span className="text-blue-400 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
