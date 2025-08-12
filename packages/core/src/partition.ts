import type { BracketInput, Match, MatchId } from './index.js';

export interface WinnerTree {
  rootId: MatchId;
  matches: MatchId[]; // sorted deterministically
}

export interface PartitionResult {
  champion: WinnerTree | null; // null when input empty or ambiguous with no suitable root
  consolation: WinnerTree[]; // sorted by rootId
}

/**
 * Partition matches into disjoint winner-trees (using winnerNextMatchId only),
 * and classify the primary championship tree versus consolation trees.
 * Deterministic and pure. Does not assume exactly one final exists.
 */
export function partitionByWinnerTrees(input: BracketInput): PartitionResult {
  const matches = input.matches ?? [];
  if (matches.length === 0) return { champion: null, consolation: [] };

  const byId = new Map<string, Match>();
  for (const m of matches) if (!byId.has(m.id)) byId.set(m.id, m);

  // Track which ids receive incoming winner feeds
  const incomingWinner = new Map<string, number>();
  const bumpIn = (id: string) => incomingWinner.set(id, (incomingWinner.get(id) ?? 0) + 1);

  // Targets of loserNextMatchId — champion tree must not receive losers.
  const loserTargets = new Set<string>();
  for (const m of matches) {
    if (m.winnerNextMatchId) bumpIn(m.winnerNextMatchId);
    if (m.loserNextMatchId) loserTargets.add(m.loserNextMatchId);
  }

  // Find root of the winner-tree for each match id (follow winnerNextMatchId until null/missing).
  const rootMemo = new Map<string, string>();
  const findRoot = (id: string): string => {
    const memo = rootMemo.get(id);
    if (memo) return memo;
    const seen: string[] = [];
    let cur = byId.get(id);
    const visited = new Set<string>();
    while (cur) {
      if (visited.has(cur.id)) {
        // Cycle: choose deterministic smallest id in the cycle we observed.
        const minId = [...visited].sort()[0];
        for (const s of seen) rootMemo.set(s, minId);
        return minId;
      }
      visited.add(cur.id);
      seen.push(cur.id);
      const next = cur.winnerNextMatchId;
      if (!next) {
        const rootId = cur.id;
        for (const s of seen) rootMemo.set(s, rootId);
        return rootId;
      }
      const parent = byId.get(next);
      if (!parent) {
        // Dangling parent: treat current as root
        const rootId = cur.id;
        for (const s of seen) rootMemo.set(s, rootId);
        return rootId;
      }
      cur = parent;
    }
    // If id not found in byId, treat id as its own root
    rootMemo.set(id, id);
    return id;
  };

  // Group by root
  const groups = new Map<string, string[]>();
  for (const m of matches) {
    const r = findRoot(m.id);
    const arr = groups.get(r) ?? [];
    arr.push(m.id);
    groups.set(r, arr);
  }

  // Normalize sorting inside each group, drop isolated singletons (no incoming winner feeds and winnerNext=null)
  const trees: WinnerTree[] = [];
  for (const [rootId, arr] of groups) {
    arr.sort((a, b) => a.localeCompare(b));
    if (arr.length === 1) {
      const only = arr[0];
      const m = byId.get(only);
      const hasIncoming = (incomingWinner.get(only) ?? 0) > 0;
      const hasOutgoing = (m?.winnerNextMatchId ?? null) !== null; // counts even if dangling
      if (!hasIncoming && !hasOutgoing) {
        // Isolated standalone match: ignore from partition
        continue;
      }
    }
    trees.push({ rootId, matches: arr });
  }
  // Sort trees by root for deterministic ordering
  trees.sort((a, b) => a.rootId.localeCompare(b.rootId));

  // Choose champion tree: prefer a tree whose root has winnerNext=null and which receives no losers.
  const isNullRoot = (id: string) => (byId.get(id)?.winnerNextMatchId ?? null) === null;
  const receivesLosers = (t: WinnerTree) => t.matches.some(id => loserTargets.has(id));

  const champCandidates = trees.filter(t => isNullRoot(t.rootId) && !receivesLosers(t));
  const championTree = (champCandidates[0] ?? trees.find(t => isNullRoot(t.rootId)) ?? trees[0]) || null;

  const consolation = championTree
    ? trees.filter(t => t.rootId !== championTree.rootId)
    : trees;

  return { champion: championTree ?? null, consolation };
}
