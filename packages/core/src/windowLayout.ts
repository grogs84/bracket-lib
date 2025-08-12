import type { Layout, LayoutNode, LayoutEdge, MatchId } from './index.js';

/**
 * Creates a filtered view of a bracket layout containing only nodes and edges 
 * within the specified round range [startRound, endRound).
 * 
 * This is useful for displaying only a portion of a large bracket, such as
 * showing rounds 1-3 of an 8-round tournament.
 * 
 * @param layout - The complete bracket layout to filter
 * @param startRound - The first round to include (inclusive)
 * @param endRound - The last round to exclude (exclusive)
 * @returns A new Layout containing only nodes and edges in the specified window
 * 
 * @example
 * ```typescript
 * // Show only rounds 1-3 (rounds 1 and 2)
 * const window = windowLayout(fullBracket, 1, 3);
 * 
 * // Show semifinals and finals (rounds 3-4 in a 4-round bracket)
 * const finalRounds = windowLayout(bracket, 3, 5);
 * ```
 */
export function windowLayout(
  layout: Layout,
  startRound: number,
  endRound: number
): Layout {
  // Clamp the range to valid bounds
  const minRound = Math.min(...layout.nodes.map((n: LayoutNode) => n.round));
  const maxRound = Math.max(...layout.nodes.map((n: LayoutNode) => n.round));
  
  const clampedStart = Math.max(startRound, minRound);
  const clampedEnd = Math.min(endRound, maxRound + 1);
  
  // If the window is invalid or empty, return empty layout
  if (clampedStart >= clampedEnd) {
    return {
      nodes: [],
      edges: [],
      rounds: []
    };
  }
  
  // Filter nodes by round range, keeping original coordinates and round numbers
  const filteredNodes = layout.nodes
    .filter((node: LayoutNode) => node.round >= clampedStart && node.round < clampedEnd)
    .sort((a: LayoutNode, b: LayoutNode) => a.id.localeCompare(b.id)); // Deterministic sort by id
  
  // Create a set of remaining node IDs for efficient lookup
  const remainingNodeIds = new Set(filteredNodes.map((node: LayoutNode) => node.id));
  
  // Filter edges - keep only edges where both endpoints remain
  const filteredEdges = layout.edges
    .filter((edge: LayoutEdge) => 
      remainingNodeIds.has(edge.from) && 
      remainingNodeIds.has(edge.to)
    )
    .sort((a: LayoutEdge, b: LayoutEdge) => {
      // Deterministic sort by from-to pair
      const fromComp = a.from.localeCompare(b.from);
      return fromComp !== 0 ? fromComp : a.to.localeCompare(b.to);
    });
  
  // Filter rounds - keep only rounds within the window and filter match IDs
  const filteredRounds: MatchId[][] = [];
  for (let roundIndex = 0; roundIndex < layout.rounds.length; roundIndex++) {
    const roundNumber = roundIndex + 1; // rounds are 1-indexed in the layout
    if (roundNumber >= clampedStart && roundNumber < clampedEnd) {
      const roundMatches = layout.rounds[roundIndex].filter((matchId: MatchId) => 
        remainingNodeIds.has(matchId)
      );
      filteredRounds.push(roundMatches);
    }
  }
  
  return {
    nodes: filteredNodes,
    edges: filteredEdges,
    rounds: filteredRounds
  };
}
