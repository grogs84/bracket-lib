import { describe, expect, it } from 'vitest';
import { buildLayout, type BracketInput } from './index';

describe('buildLayout single-elim basics', () => {
  it('layouts a 4-team bracket deterministically', () => {
    const input: BracketInput = {
      matches: [
        { id: 'M1', winnerNextMatchId: 'F' },
        { id: 'M2', winnerNextMatchId: 'F' },
        { id: 'F', winnerNextMatchId: null }
      ]
    };
    const layout = buildLayout(input, { hGap: 100, vGap: 50 });

    expect(layout.rounds.length).toBe(2); // R0 (semis), R1 (final)
    // Earliest round should contain M1, M2 (order by id)
    expect(layout.rounds[0]).toEqual(['M1', 'M2']);
    // Finals last
    expect(layout.rounds[1]).toEqual(['F']);

    const nodeMap = new Map(layout.nodes.map(n => [n.id, n]));
    const m1 = nodeMap.get('M1')!;
    const m2 = nodeMap.get('M2')!;
    const f = nodeMap.get('F')!;

    expect(m1.round).toBe(0);
    expect(m2.round).toBe(0);
    expect(f.round).toBe(1);

    // Midpoint y placement
    expect(f.y).toBe((m1.y + m2.y) / 2);

    // Winner edges
    expect(layout.edges).toEqual([
      { from: 'M1', to: 'F', kind: 'winner' },
      { from: 'M2', to: 'F', kind: 'winner' }
    ]);
  });

  it('handles byes (single child)', () => {
    const input: BracketInput = {
      matches: [
        { id: 'QF1', winnerNextMatchId: 'SF1' },
        { id: 'SF1', winnerNextMatchId: 'F' },
        { id: 'QF2', winnerNextMatchId: 'SF2' },
        { id: 'SF2', winnerNextMatchId: 'F' },
        { id: 'F', winnerNextMatchId: null }
      ]
    };
    const layout = buildLayout(input);
    expect(layout.nodes.length).toBe(5);
    expect(layout.rounds.at(-1)).toEqual(['F']);
  });
});
