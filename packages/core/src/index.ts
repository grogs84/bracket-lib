// Public types (stable)
export type MatchId = string;

export interface ParticipantRef {
  name: string;
  seed?: number | null;
  school?: string | null;
}

export interface Match {
  id: MatchId;
  winnerNextMatchId: MatchId | null;
  loserNextMatchId?: MatchId | null;
  left?: ParticipantRef | null;
  right?: ParticipantRef | null;
  roundHint?: string | null;
}

export interface BracketInput {
  matches: Match[];
}

export interface LayoutNode {
  id: MatchId;
  x: number;
  y: number;
  round: number;
}

export interface LayoutEdge {
  from: MatchId;
  to: MatchId;
  kind: 'winner' | 'loser';
}

export interface Layout {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  rounds: MatchId[][];
}

export interface BuildLayoutOptions {
  hGap?: number; // horizontal spacing between rounds (px)
  vGap?: number; // vertical spacing between rows (px)
}

/**
 * buildLayout
 * Pure single-elim builder:
 * - Builds rooted tree via winnerNextMatchId edges.
 * - DFS to compute depths; rounds = maxDepth - depth for earliest→finals ordering.
 * - Vertical placement: leaves occupy rows; internal nodes are midpoint of their children.
 * Deterministic: children sorted by id.
 */
export function buildLayout(
  input: BracketInput,
  opts: BuildLayoutOptions = {}
): Layout {
  const hGap = opts.hGap ?? 160;
  const vGap = opts.vGap ?? 80;

  const matchesById = new Map<string, Match>();
  for (const m of input.matches) {
    if (matchesById.has(m.id)) {
      throw new Error(`Duplicate match id: ${m.id}`);
    }
    matchesById.set(m.id, m);
  }
  if (matchesById.size === 0) {
    return { nodes: [], edges: [], rounds: [] };
  }

  // Identify root (final)
  const roots = input.matches.filter(m => m.winnerNextMatchId === null);
  if (roots.length !== 1) {
    throw new Error(
      `Expected exactly 1 finals (winnerNextMatchId === null), got ${roots.length}`
    );
  }
  const root = roots[0];

  // children map: parentId -> child matches whose winners feed into parent
  const children = new Map<string, Match[]>();
  for (const m of input.matches) {
    const p = m.winnerNextMatchId;
    if (p !== null) {
      const arr = children.get(p) ?? [];
      arr.push(m);
      children.set(p, arr);
    }
  }
  // determinism
  for (const [k, arr] of children) {
    arr.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    children.set(k, arr);
  }

  // DFS: compute depth, vertical rows, collect edges
  const depthById = new Map<string, number>();
  const yRowById = new Map<string, number>();
  const edges: LayoutEdge[] = [];

  // Assign leaf rows incrementally; internal nodes get midpoint
  let nextLeafRow = 0;

  function dfsAssign(node: Match, depth: number): number {
    depthById.set(node.id, depth);

    const kids = children.get(node.id) ?? [];
    if (kids.length === 0) {
      const row = nextLeafRow++;
      yRowById.set(node.id, row);
      return row;
    }

    // Visit children first (post-order)
    const childRows: number[] = [];
    for (const child of kids) {
      edges.push({ from: child.id, to: node.id, kind: 'winner' });
      const r = dfsAssign(child, depth + 1);
      childRows.push(r);
    }

    // Midpoint of children
    const minR = Math.min(...childRows);
    const maxR = Math.max(...childRows);
    const myRow = (minR + maxR) / 2;
    yRowById.set(node.id, myRow);
    return myRow;
  }

  dfsAssign(root, 0);

  // Compute rounds from depths with finals as highest index
  let maxDepth = 0;
  for (const d of depthById.values()) maxDepth = Math.max(maxDepth, d);

  // Build nodes with coordinates
  const nodes: LayoutNode[] = [];
  for (const [id, depth] of depthById) {
    const round = maxDepth - depth; // earliest=0 ... finals=maxDepth
    const row = yRowById.get(id)!;
    nodes.push({
      id,
      x: round * hGap,
      y: row * vGap,
      round
    });
  }

  // Sort nodes by round then y then id for stability
  nodes.sort((a, b) =>
    a.round !== b.round
      ? a.round - b.round
      : a.y !== b.y
      ? a.y - b.y
      : a.id.localeCompare(b.id)
  );

  // Build rounds matrix
  const rounds: MatchId[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const n of nodes) {
    rounds[n.round].push(n.id);
  }

  return { nodes, edges, rounds };
}

export { USER_BRACKET, USER_BRACKET_RAW, toBracketInput } from './samples';
export { windowLayout } from './windowLayout.js';
export { partitionByWinnerTrees, type PartitionResult, type WinnerTree } from './partition.js';
