import { useEffect, useMemo, useState } from "react";
import { Network } from "lucide-react";
import { useDocumentsContext } from "../../context/DocumentsContext";
import { getKnowledgeGraph } from "../../services/api";
import { PageHeader, Card, Spinner, ErrorNotice, EmptyState } from "../../components/ui/Primitives";

const GROUP_COLORS = {
  concept: "#60a5fa",
  component: "#34d399",
  process: "#fbbf24",
  spec: "#f472b6",
  default: "#94a3b8",
};

const WIDTH = 760;
const HEIGHT = 460;

// Small force-directed layout, computed synchronously (graphs here are <=18
// nodes so a few dozen iterations is instant and needs no extra dependency).
function layoutGraph(nodes, edges) {
  const positions = {};
  const n = nodes.length || 1;

  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / n;
    positions[node.id] = {
      x: WIDTH / 2 + Math.cos(angle) * (WIDTH / 3),
      y: HEIGHT / 2 + Math.sin(angle) * (HEIGHT / 3),
    };
  });

  const k = Math.sqrt((WIDTH * HEIGHT) / Math.max(n, 1)) * 0.9;

  for (let iter = 0; iter < 200; iter++) {
    const forces = {};
    nodes.forEach((a) => { forces[a.id] = { x: 0, y: 0 }; });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = positions[a.id].x - positions[b.id].x;
        const dy = positions[a.id].y - positions[b.id].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const repulse = (k * k) / dist;
        forces[a.id].x += (dx / dist) * repulse * 0.02;
        forces[a.id].y += (dy / dist) * repulse * 0.02;
        forces[b.id].x -= (dx / dist) * repulse * 0.02;
        forces[b.id].y -= (dy / dist) * repulse * 0.02;
      }
    }

    edges.forEach(({ source, target }) => {
      if (!positions[source] || !positions[target]) return;
      const dx = positions[source].x - positions[target].x;
      const dy = positions[source].y - positions[target].y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const attract = (dist * dist) / k;
      forces[source].x -= (dx / dist) * attract * 0.01;
      forces[source].y -= (dy / dist) * attract * 0.01;
      forces[target].x += (dx / dist) * attract * 0.01;
      forces[target].y += (dy / dist) * attract * 0.01;
    });

    nodes.forEach((node) => {
      positions[node.id].x += forces[node.id].x;
      positions[node.id].y += forces[node.id].y;
      positions[node.id].x = Math.min(WIDTH - 60, Math.max(60, positions[node.id].x));
      positions[node.id].y = Math.min(HEIGHT - 40, Math.max(40, positions[node.id].y));
    });
  }

  return positions;
}

export default function KnowledgeGraph() {
  const { activeDocId, activeDocument, documents } = useDocumentsContext();
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    if (!activeDocId) return;
    setLoading(true);
    setError("");
    setGraph(null);
    setActiveNode(null);
    getKnowledgeGraph(activeDocId)
      .then((data) => setGraph(data.graph))
      .catch((err) => setError(err.message || "Could not build knowledge graph."))
      .finally(() => setLoading(false));
  }, [activeDocId]);

  const positions = useMemo(() => {
    if (!graph?.nodes?.length) return {};
    return layoutGraph(graph.nodes, graph.edges || []);
  }, [graph]);

  if (documents.length === 0) {
    return <EmptyState icon={Network} title="No document selected" description="Upload a PDF to generate its knowledge graph." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Feature"
        title="Knowledge Graph"
        description={activeDocument ? `Concepts and relationships extracted from "${activeDocument.filename}"` : "Select a document"}
      />

      {loading && <Spinner label="Mapping concepts and relationships..." />}
      {error && <ErrorNotice message={error} />}

      {graph && !loading && (
        graph.nodes.length === 0 ? (
          <EmptyState title="No graph could be generated" description="Try a document with more distinct concepts or terminology." />
        ) : (
          <Card className="p-4">
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-[460px]">
              {(graph.edges || []).map((e, i) => {
                const s = positions[e.source], t = positions[e.target];
                if (!s || !t) return null;
                const dim = activeNode && activeNode !== e.source && activeNode !== e.target;
                return (
                  <g key={i} opacity={dim ? 0.15 : 1}>
                    <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#475569" strokeWidth={1.5} />
                    <text
                      x={(s.x + t.x) / 2}
                      y={(s.y + t.y) / 2 - 4}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {e.label}
                    </text>
                  </g>
                );
              })}

              {graph.nodes.map((node) => {
                const p = positions[node.id];
                if (!p) return null;
                const color = GROUP_COLORS[node.group] || GROUP_COLORS.default;
                const dim = activeNode && activeNode !== node.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${p.x}, ${p.y})`}
                    opacity={dim ? 0.35 : 1}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="cursor-pointer"
                  >
                    <circle r={16} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={2} />
                    <circle r={4} fill={color} />
                    <text y={30} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight={500}>
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-800">
              {Object.entries(GROUP_COLORS).filter(([k]) => k !== "default").map(([group, color]) => (
                <div key={group} className="flex items-center gap-2 text-xs text-slate-400 capitalize">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  {group}
                </div>
              ))}
            </div>
          </Card>
        )
      )}
    </div>
  );
}
