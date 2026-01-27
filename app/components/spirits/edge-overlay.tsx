import { useMemo } from "react";

interface PresenceNodeData {
  id: string;
  row: number;
  col: number;
}

interface EdgeData {
  from: string;
  to: string;
  bidirectional?: boolean;
}

interface EdgeOverlayProps {
  edges: EdgeData[];
  nodes: PresenceNodeData[];
  rows: number;
  cols: number;
  globalBidirectional?: boolean;
}

/**
 * SVG overlay for rendering non-adjacent edges in presence track graphs.
 *
 * Design decisions:
 * - Uses viewBox="0 0 100 100" with percentage-based positioning for responsive scaling
 * - preserveAspectRatio="none" ensures SVG stretches to match grid container
 * - pointer-events-none keeps nodes clickable through the overlay
 * - Dashed lines (strokeDasharray) distinguish connections from grid structure
 * - Arrow marker shows direction for unidirectional edges
 *
 * Adjacent edges (same row, col diff of 1) are filtered out since they're
 * implicit in the grid layout.
 */
export function EdgeOverlay({
  edges,
  nodes,
  rows,
  cols,
  globalBidirectional = true,
}: EdgeOverlayProps) {
  // Create node lookup map for fast access
  const nodeMap = useMemo(() => {
    const map = new Map<string, PresenceNodeData>();
    for (const node of nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [nodes]);

  // Filter to non-adjacent edges only
  const nonAdjacentEdges = useMemo(() => {
    return edges.filter((edge) => {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) return false;

      // Adjacent = same row, col diff of 1
      const sameRow = fromNode.row === toNode.row;
      const colDiff = Math.abs(fromNode.col - toNode.col);
      const isHorizontalAdjacent = sameRow && colDiff === 1;

      return !isHorizontalAdjacent;
    });
  }, [edges, nodeMap]);

  if (nonAdjacentEdges.length === 0) {
    return null;
  }

  // Calculate node center position as percentage
  const getNodeCenter = (node: PresenceNodeData) => ({
    x: ((node.col + 0.5) / cols) * 100,
    y: ((node.row + 0.5) / rows) * 100,
  });

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Arrow marker for unidirectional edges */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="currentColor"
            className="text-muted-foreground/50"
          />
        </marker>
      </defs>

      {nonAdjacentEdges.map((edge) => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (!fromNode || !toNode) return null;

        const from = getNodeCenter(fromNode);
        const to = getNodeCenter(toNode);
        const isBidirectional = edge.bidirectional ?? globalBidirectional;

        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            className="stroke-muted-foreground/40"
            strokeWidth="1"
            strokeDasharray="4 2"
            markerEnd={!isBidirectional ? "url(#arrowhead)" : undefined}
          />
        );
      })}
    </svg>
  );
}
