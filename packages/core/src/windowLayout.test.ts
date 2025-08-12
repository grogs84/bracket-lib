import { describe, it, expect, beforeAll } from 'vitest';
import { windowLayout, buildLayout } from './index.js';
import { SAMPLE_4_ROUND_BRACKET } from './test/__fixtures__/sampleLayouts.js';
import type { Layout, LayoutNode, LayoutEdge } from './index.js';

describe('windowLayout', () => {
  let sampleLayout: Layout;

  beforeAll(() => {
    // Build a 4-round layout for testing
    sampleLayout = buildLayout(SAMPLE_4_ROUND_BRACKET);
  });

  it('should filter nodes by round range [1,3)', () => {
    const result = windowLayout(sampleLayout, 1, 3);
    
    // Should include rounds 1 and 2, exclude round 3
    const resultRounds = result.nodes.map((n: LayoutNode) => n.round);
    expect(Math.min(...resultRounds)).toBe(1);
    expect(Math.max(...resultRounds)).toBe(2);
    
    // Should have nodes from rounds 1 and 2 only
    const round1Nodes = result.nodes.filter((n: LayoutNode) => n.round === 1);
    const round2Nodes = result.nodes.filter((n: LayoutNode) => n.round === 2);
    const round3Nodes = result.nodes.filter((n: LayoutNode) => n.round === 3);
    
    expect(round1Nodes.length).toBeGreaterThan(0);
    expect(round2Nodes.length).toBeGreaterThan(0);
    expect(round3Nodes.length).toBe(0);
  });

  it('should preserve original node coordinates and round numbers', () => {
    const result = windowLayout(sampleLayout, 1, 3);
    
    // Find a node that exists in both original and filtered
    const originalNode = sampleLayout.nodes.find((n: LayoutNode) => n.round === 1);
    const filteredNode = result.nodes.find((n: LayoutNode) => n.id === originalNode?.id);
    
    expect(filteredNode).toBeDefined();
    expect(filteredNode!.x).toBe(originalNode!.x);
    expect(filteredNode!.y).toBe(originalNode!.y);
    expect(filteredNode!.round).toBe(originalNode!.round);
  });

  it('should keep only edges whose endpoints remain', () => {
    const result = windowLayout(sampleLayout, 1, 3);
    const remainingNodeIds = new Set(result.nodes.map((n: LayoutNode) => n.id));
    
    // All edges should have both endpoints in the remaining nodes
    for (const edge of result.edges) {
      expect(remainingNodeIds.has(edge.from)).toBe(true);
      expect(remainingNodeIds.has(edge.to)).toBe(true);
    }
  });

  it('should return empty layout for invalid window ranges', () => {
    // Start >= end
    let result = windowLayout(sampleLayout, 3, 3);
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
    expect(result.rounds).toHaveLength(0);
    
    // Start > end
    result = windowLayout(sampleLayout, 4, 2);
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
    expect(result.rounds).toHaveLength(0);
  });

  it('should handle out-of-range clamping', () => {
    // Request range beyond available rounds
    const result = windowLayout(sampleLayout, -5, 100);
    
    // Should clamp to actual range of the layout
    const minRound = Math.min(...sampleLayout.nodes.map((n: LayoutNode) => n.round));
    const maxRound = Math.max(...sampleLayout.nodes.map((n: LayoutNode) => n.round));
    
    const resultMinRound = Math.min(...result.nodes.map((n: LayoutNode) => n.round));
    const resultMaxRound = Math.max(...result.nodes.map((n: LayoutNode) => n.round));
    
    expect(resultMinRound).toBe(minRound);
    expect(resultMaxRound).toBe(maxRound);
  });

  it('should be deterministic with stable sorting', () => {
    const result1 = windowLayout(sampleLayout, 1, 4);
    const result2 = windowLayout(sampleLayout, 1, 4);
    
    // Node order should be identical
    expect(result1.nodes.map((n: LayoutNode) => n.id)).toEqual(result2.nodes.map((n: LayoutNode) => n.id));
    
    // Edge order should be identical
    expect(result1.edges.map((e: LayoutEdge) => `${e.from}->${e.to}`))
      .toEqual(result2.edges.map((e: LayoutEdge) => `${e.from}->${e.to}`));
  });

  it('should not mutate the input layout (purity test)', () => {
    const originalNodes = [...sampleLayout.nodes];
    const originalEdges = [...sampleLayout.edges];
    const originalRounds = sampleLayout.rounds.map((round: string[]) => [...round]);
    
    // Perform windowing operation
    windowLayout(sampleLayout, 1, 3);
    
    // Verify original layout is unchanged
    expect(sampleLayout.nodes).toEqual(originalNodes);
    expect(sampleLayout.edges).toEqual(originalEdges);
    expect(sampleLayout.rounds).toEqual(originalRounds);
  });

  it('should filter rounds property correctly', () => {
    const result = windowLayout(sampleLayout, 1, 3);
    
    // Should have 2 rounds (1 and 2)
    expect(result.rounds).toHaveLength(2);
    
    // Each round should contain only match IDs that are in the filtered nodes
    const nodeIds = new Set(result.nodes.map((n: LayoutNode) => n.id));
    for (const round of result.rounds) {
      for (const matchId of round) {
        expect(nodeIds.has(matchId)).toBe(true);
      }
    }
  });

  it('should handle single round window', () => {
    const result = windowLayout(sampleLayout, 2, 3);
    
    // Should contain only round 2
    const rounds = result.nodes.map((n: LayoutNode) => n.round);
    expect(Math.min(...rounds)).toBe(2);
    expect(Math.max(...rounds)).toBe(2);
    expect(result.rounds).toHaveLength(1);
  });
});
