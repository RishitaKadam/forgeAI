import { useState } from "react";
import { Search as SearchIcon, FileText } from "lucide-react";
import { useDocumentsContext } from "../../context/DocumentsContext";
import { smartSearch } from "../../services/api";
import { PageHeader, Card, Spinner, ErrorNotice, EmptyState, Badge } from "../../components/ui/Primitives";

export default function SmartSearch() {
  const { activeDocId, activeDocument, documents } = useDocumentsContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await smartSearch(query, activeDocId);
      setResults(data.results);
    } catch (err) {
      setError(err.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  function highlight(snippet) {
    const terms = query.trim().split(/\s+/).filter((t) => t.length > 2);
    if (terms.length === 0) return snippet;
    const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
    const parts = snippet.split(pattern);
    return parts.map((part, i) =>
      terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
        <mark key={i} className="bg-blue-500/30 text-blue-200 rounded px-0.5">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  if (documents.length === 0) {
    return <EmptyState icon={SearchIcon} title="No documents to search" description="Upload a PDF first to search inside it." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Feature"
        title="Smart Search"
        description={`Semantic search with page navigation${activeDocument ? ` across "${activeDocument.filename}"` : " across all documents"}.`}
      />

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a concept, spec, or keyword..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-600/50 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 outline-none transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 rounded-xl transition"
        >
          Search
        </button>
      </form>

      {loading && <Spinner label="Searching document..." />}
      {error && <ErrorNotice message={error} />}

      {results && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
          {results.map((r, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">{r.source}</span>
                </div>
                {r.page && <Badge tone="blue">Page {r.page}</Badge>}
              </div>
              <p className="text-slate-300 text-sm leading-6">{highlight(r.snippet)}...</p>
            </Card>
          ))}
          {results.length === 0 && (
            <EmptyState title="No matches found" description="Try a different search term." />
          )}
        </div>
      )}
    </div>
  );
}
