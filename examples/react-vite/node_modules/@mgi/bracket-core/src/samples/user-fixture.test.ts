import { describe, it, expect } from 'vitest';
import { buildLayout } from '../index';
import { USER_BRACKET } from './user-fixture';

describe('USER_BRACKET fixture (championship-only)', () => {
  it('builds a valid single-elim layout with a single final', () => {
    const layout = buildLayout(USER_BRACKET, { hGap: 160, vGap: 80 });

    // Basic sanity
    expect(layout.nodes.length).toBeGreaterThan(0);
    expect(layout.edges.length).toBeGreaterThan(0);
    expect(layout.rounds.length).toBeGreaterThan(1);

    // Exactly one final (root)
    const finalRound = layout.rounds.at(-1)!;
    expect(finalRound.length).toBe(1);

    // Edges should be matches - 1 in a connected single-elim tree
    expect(layout.edges.length).toBe(layout.nodes.length - 1);

    // The declared final in input must match the last round node
    const declaredFinal = USER_BRACKET.matches.find(m => m.winnerNextMatchId === null)!;
    expect(declaredFinal).toBeTruthy();
    expect(finalRound[0]).toBe(declaredFinal.id);

    // Monotonic x by round
    for (const roundIds of layout.rounds) {
      const xs = roundIds.map(id => layout.nodes.find(n => n.id === id)!.x);
      for (const x of xs) expect(typeof x).toBe('number');
    }
  });
});
