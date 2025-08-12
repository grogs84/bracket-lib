import { describe, it, expect } from 'vitest';
import { partitionByWinnerTrees } from './index.js';
import type { BracketInput } from './index.js';

function make(matches: BracketInput['matches']): BracketInput { return { matches }; }

describe('partitionByWinnerTrees', () => {
  it('returns null champion and empty consolation for empty input', () => {
    const res = partitionByWinnerTrees(make([]));
    expect(res.champion).toBeNull();
    expect(res.consolation).toEqual([]);
  });

  it('single tree with final -> champion is that tree, no consolation', () => {
    const input = make([
      { id: 'M1', winnerNextMatchId: 'F' },
      { id: 'M2', winnerNextMatchId: 'F' },
      { id: 'F', winnerNextMatchId: null }
    ]);
    const res = partitionByWinnerTrees(input);
    expect(res.champion?.rootId).toBe('F');
    expect(res.champion?.matches).toEqual(['F','M1','M2']);
    expect(res.consolation.length).toBe(0);
  });

  it('two disjoint trees: chooses the one with winnerNext=null as champion', () => {
    const input = make([
      { id: 'A1', winnerNextMatchId: 'AF' },
      { id: 'A2', winnerNextMatchId: 'AF' },
      { id: 'AF', winnerNextMatchId: null },
      { id: 'B1', winnerNextMatchId: 'BF' },
      { id: 'B2', winnerNextMatchId: 'BF' },
      { id: 'BF', winnerNextMatchId: null }
    ]);
    const res = partitionByWinnerTrees(input);
    // Deterministic ordering means champion is by smallest root id ('AF')
    expect(res.champion?.rootId).toBe('AF');
    expect(res.consolation.map(t => t.rootId)).toEqual(['BF']);
  });

  it('prefers a tree whose root does not receive losers as champion', () => {
    const input = make([
      { id: 'UP1', winnerNextMatchId: 'UF' },
      { id: 'UP2', winnerNextMatchId: 'UF' },
      { id: 'UF', winnerNextMatchId: null },
      { id: 'C1', winnerNextMatchId: 'CF' },
      { id: 'C2', winnerNextMatchId: 'CF' },
      { id: 'CF', winnerNextMatchId: null },
      // loser feeds into CF (marks that tree as consolation)
      { id: 'X', winnerNextMatchId: null, loserNextMatchId: 'CF' }
    ]);
    const res = partitionByWinnerTrees(input);
    expect(res.champion?.rootId).toBe('UF');
    expect(res.consolation.map(t => t.rootId)).toEqual(['CF']);
  });

  it('handles dangling parents: treat leaf as root of its own tree', () => {
    const input = make([
      { id: 'M1', winnerNextMatchId: 'M2' },
      { id: 'M3', winnerNextMatchId: 'M99' } // M99 missing
    ]);
    const res = partitionByWinnerTrees(input);
    const roots = [res.champion?.rootId, ...res.consolation.map(t => t.rootId)].filter(Boolean).sort();
    expect(roots).toEqual(['M1','M3']);
  });

  it('breaks cycles deterministically by selecting smallest id as root', () => {
    const input = make([
      { id: 'A', winnerNextMatchId: 'B' },
      { id: 'B', winnerNextMatchId: 'A' }
    ]);
    const res = partitionByWinnerTrees(input);
    // Smallest id is 'A'
    expect(res.champion?.rootId).toBe('A');
    expect(res.champion?.matches).toEqual(['A','B']);
  });
});
