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

const RING_SPACING = 130;
const MIN_RADIUS = 110;
const CHAR_WIDTH = 6.2;
const LABEL_PADDING = 46;

// Hierarchical hub-and-ring layout: the most-connected node becomes the
// center, and every other node is placed by its shortest hop distance from
// that hub (BFS), arranged around concentric rings. Ring radius grows with
// however much label width that ring actually needs, so labels never
// collide - this replaces the old force simulation, which produced a
// visually "random" graph with no readable hierarchy.
function layoutGraph(nodes, edges) {
  if (!nodes.length) return { positions: {}, hubId: null, width: 760, height: 460 };

  const adjacency = {};
  nodes.forEach((n) => { adjacency[n.id] = new Set(); });
  edges.forEach(({ source, target }) => {
    if (adjacency[source] && adjacency[target]) {
      adjacency[source].add(target);
      adjacency[target].add(source);
    }
  });

  // hub = highest-degree node (the most "central" concept in the document)
  let hubId = nodes[0].id;
  let maxDegree = -1;
  nodes.forEach((n) => {
    const degree = adjacency[n.id]?.size || 0;
    if (degree > maxDegree) {
      maxDegree = degree;
      hubId = n.id;
    }
  });

  // BFS distance from hub -> ring index
  const level = { [hubId]: 0 };
  const queue = [hubId];
  while (queue.length) {
    const current = queue.shift();
    adjacency[current]?.forEach((neighbor) => {
      if (!(neighbor in level)) {
        level[neighbor] = level[current] + 1;
        queue.push(neighbor);
      }
    });
  }
  // any node unreachable from the hub (disconnected) goes on an outer ring
  const maxKnownLevel = Math.max(0, ...Object.values(level));
  nodes.forEach((n) => {
    if (!(n.id in level)) level[n.id] = maxKnownLevel + 1;
  });

  const rings = {};
  nodes.forEach((n) => {
    const lvl = level[n.id];
    (rings[lvl] ||= []).push(n);
  });

  const ringRadii = {};
  let outerRadius = MIN_RADIUS;
  Object.entries(rings).forEach(([lvl, ringNodes]) => {
    const l = Number(lvl);
    if (l === 0) return;
    const neededCircumference = ringNodes.reduce(
      (sum, n) => sum + n.label.length * CHAR_WIDTH + LABEL_PADDING,
      0
    );
    const radiusForWidth = neededCircumference / (2 * Math.PI);
    const radius = Math.max(MIN_RADIUS + (l - 1) * RING_SPACING, radiusForWidth, l * 90);
    ringRadii[l] = radius;
    outerRadius = Math.max(outerRadius, radius);
  });

  const width = Math.max(760, outerRadius * 2 + 160);
  const height = Math.max(520, outerRadius * 2 + 160);
  const cx = width / 2;
  const cy = height / 2;

  const positions = { [hubId]: { x: cx, y: cy } };
  Object.entries(rings).forEach(([lvl, ringNodes]) => {
    const l = Number(lvl);
    if (l === 0) return;
    const radius = ringRadii[l];
    ringNodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / ringNodes.length - Math.PI / 2;
      positions[node.id] = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      };
    });
  });

  return { positions, hubId, width, height };
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

  const { positions, hubId, width, height } = useMemo(() => {
    if (!graph?.nodes?.length) return { positions: {}, hubId: null, width: 760, height: 460 };
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
            <p className="text-xs text-slate-500 mb-3">
              The central node is the most connected concept in the document. Hover any node to trace its relationships.
            </p>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: Math.min(height, 560) }}>
              <defs>
                <marker id="kg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
                </marker>
              </defs>

              {(graph.edges || []).map((e, i) => {
                const s = positions[e.source], t = positions[e.target];
                if (!s || !t) return null;
                const connected = activeNode && (activeNode === e.source || activeNode === e.target);
                const dim = activeNode && !connected;
                const midX = (s.x + t.x) / 2;
                const midY = (s.y + t.y) / 2;
                return (
                  <g key={i} opacity={dim ? 0.12 : 1}>
                    <line
                      x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                      stroke={connected ? "#93c5fd" : "#475569"}
                      strokeWidth={connected ? 2 : 1.3}
                      markerEnd="url(#kg-arrow)"
                    />
                    {connected && e.label && (
                      <>
                        <rect
                          x={midX - (e.label.length * 3.4)} y={midY - 12}
                          width={e.label.length * 6.8} height={15}
                          rx={4} fill="#0f172a" stroke="#1e293b"
                        />
                        <text x={midX} y={midY - 1} fill="#93c5fd" fontSize="9.5" textAnchor="middle" fontWeight={500}>
                          {e.label}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {graph.nodes.map((node) => {
                const p = positions[node.id];
                if (!p) return null;
                const isHub = node.id === hubId;
                const color = GROUP_COLORS[node.group] || GROUP_COLORS.default;
                const dim = activeNode && activeNode !== node.id;
                const labelWidth = node.label.length * 6.4 + 12;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${p.x}, ${p.y})`}
                    opacity={dim ? 0.3 : 1}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="cursor-pointer"
                  >
                    <circle r={isHub ? 22 : 15} fill={color} fillOpacity={isHub ? 0.28 : 0.18} stroke={color} strokeWidth={isHub ? 2.5 : 2} />
                    <circle r={isHub ? 6 : 4} fill={color} />
                    <rect
                      x={-labelWidth / 2} y={isHub ? 30 : 24}
                      width={labelWidth} height={17}
                      rx={5} fill="#0f172a" fillOpacity={0.9}
                    />
                    <text
                      y={isHub ? 42 : 36}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize={isHub ? "12" : "11"}
                      fontWeight={isHub ? 700 : 500}
                    >
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
              <div className="flex items-center gap-2 text-xs text-slate-500 ml-auto">
                <span className="w-3 h-3 rounded-full border-2 border-slate-500" /> larger circle = central concept
              </div>
            </div>
          </Card>
        )
      )}
    </div>
  );
}