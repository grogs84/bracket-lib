import { describe, expect, it } from 'vitest';
import { buildLayout, type BracketInput } from './index';

function makeSingleElimBracket(n: number): BracketInput {
  if (n < 2 || (n & (n - 1)) !== 0) throw new Error('size must be a power of two >= 2');
  const matches: BracketInput['matches'] = [];
  const rounds: string[][] = [];
  const labelForCount = (count: number) => {
    switch (count) {
      case 16: return 'R32';
      case 8: return 'R16';
      case 4: return 'QF';
      case 2: return 'SF';
      case 1: return 'F';
      default: return `R${count * 2}`;
    }
  };
  for (let count = n / 2; count >= 1; count = count / 2) {
    const label = labelForCount(count);
    rounds.push(Array.from({ length: count }, (_, i) => `${label}-${i + 1}`));
  }
  for (let r = 0; r < rounds.length; r++) {
    const curr = rounds[r];
    const next = rounds[r + 1];
    for (let i = 0; i < curr.length; i++) {
      const id = curr[i];
      const winnerNextMatchId = next ? next[Math.floor(i / 2)] : null;
      const m: any = { id, winnerNextMatchId, roundHint: id.split('-')[0] };
      if (r === 0) {
        const leftSeed = i + 1;
        const rightSeed = curr.length * 2 - i;
        m.left = { name: `Team ${leftSeed}`, seed: leftSeed };
        m.right = { name: `Team ${rightSeed}`, seed: rightSeed };
      }
      matches.push(m);
    }
  }
  return { matches };
}

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
    expect(layout.rounds[0]).toEqual(['M1', 'M2']);
    expect(layout.rounds[1]).toEqual(['F']);

    const nodeMap = new Map(layout.nodes.map(n => [n.id, n]));
    const m1 = nodeMap.get('M1')!;
    const m2 = nodeMap.get('M2')!;
    const f = nodeMap.get('F')!;

    expect(m1.round).toBe(0);
    expect(m2.round).toBe(0);
    expect(f.round).toBe(1);
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

  it('layouts a 32-team bracket with correct counts and centering', () => {
    const input = makeSingleElimBracket(32);
    const layout = buildLayout(input, { hGap: 160, vGap: 40 });

    // 32 teams -> 31 matches total across 5 rounds
    expect(layout.rounds.length).toBe(5);
    expect(layout.rounds[0].length).toBe(16);
    expect(layout.rounds[1].length).toBe(8);
    expect(layout.rounds[2].length).toBe(4);
    expect(layout.rounds[3].length).toBe(2);
    expect(layout.rounds[4].length).toBe(1);

    expect(layout.nodes.length).toBe(31);
    expect(layout.edges.length).toBe(30);

    const map = new Map(layout.nodes.map(n => [n.id, n]));
    const finalId = layout.rounds[4][0];
    const sf1 = layout.rounds[3][0];
    const sf2 = layout.rounds[3][1];
    expect(map.get(finalId)!.y).toBe((map.get(sf1)!.y + map.get(sf2)!.y) / 2);
  });
});

describe('determinism with randomized input order', () => {
  it('produces identical layout regardless of match array order', () => {
    const base = makeSingleElimBracket(32);

    // Canonical layout from ordered input
    const canonical = buildLayout(base, { hGap: 160, vGap: 40 });

    // Shuffle a copy of matches
    const shuffled: BracketInput = { matches: base.matches.slice() };
    for (let i = shuffled.matches.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled.matches[i], shuffled.matches[j]] = [shuffled.matches[j], shuffled.matches[i]];
    }

    const layout2 = buildLayout(shuffled, { hGap: 160, vGap: 40 });

    // Rounds grouping should match exactly
    expect(layout2.rounds).toEqual(canonical.rounds);

    // Nodes per id should have same x,y,round
    const map1 = new Map(canonical.nodes.map(n => [n.id, n]));
    const map2 = new Map(layout2.nodes.map(n => [n.id, n]));
    expect(map2.size).toBe(map1.size);
    for (const [id, n1] of map1) {
      const n2 = map2.get(id);
      expect(n2).toBeTruthy();
      expect({ x: n2!.x, y: n2!.y, round: n2!.round }).toEqual({ x: n1.x, y: n1.y, round: n1.round });
    }

    // Edges as sorted lists should match
    const sortEdges = (es: typeof canonical.edges) =>
      es
        .map(e => ({ ...e }))
        .sort((a, b) => (a.from + '>' + a.to).localeCompare(b.from + '>' + b.to));
    expect(sortEdges(layout2.edges)).toEqual(sortEdges(canonical.edges));
  });
});

describe('single-elim with a first-round bye', () => {
  it('has 30 matches (32-slot bracket with 1 bye) and keeps structure stable', () => {
    const full = makeSingleElimBracket(32);
    // Remove one first-round match to simulate a bye advancing a wrestler
    const byeId = 'R32-16'; // feeds into R16-8 alongside R32-15
    const withBye: BracketInput = {
      matches: full.matches.filter(m => m.id !== byeId)
    };

    const layout = buildLayout(withBye, { hGap: 160, vGap: 40 });

    // 31 - 1 = 30 matches
    expect(layout.nodes.length).toBe(30);
    expect(layout.edges.length).toBe(29);

    // Round counts: R32 drops from 16 to 15
    expect(layout.rounds.length).toBe(5);
    expect(layout.rounds[0].length).toBe(15);
    expect(layout.rounds[1].length).toBe(8);
    expect(layout.rounds[2].length).toBe(4);
    expect(layout.rounds[3].length).toBe(2);
    expect(layout.rounds[4].length).toBe(1);

    // The affected R16 match should align vertically with its single child
    const r16Id = 'R16-8';
    const nodeMap = new Map(layout.nodes.map(n => [n.id, n]));
    const edgesToR16 = layout.edges.filter(e => e.to === r16Id);
    expect(edgesToR16.length).toBe(1);
    const child = nodeMap.get(edgesToR16[0].from)!;
    const parent = nodeMap.get(r16Id)!;
    expect(parent.y).toBe(child.y);
  });
});

describe('pigtail (play-in) matches feeding into R32', () => {
  function addPigtails(base: BracketInput, count: 1 | 2): BracketInput {
    const matches = base.matches.slice();
    const makePt = (idx: number) => ({
      id: `PGT-${idx}`,
      winnerNextMatchId: `R32-${idx}`,
      left: { name: `PlayIn ${idx}A` },
      right: { name: `PlayIn ${idx}B` },
      roundHint: 'PT'
    });
    for (let i = 1; i <= count; i++) matches.push(makePt(i));
    return { matches } as BracketInput;
  }

  it('1 pigtail → earliest round has 1, totals adjust', () => {
    const base = makeSingleElimBracket(32);
    const input = addPigtails(base, 1);
    const layout = buildLayout(input, { hGap: 160, vGap: 40 });

    expect(layout.nodes.length).toBe(32); // 31 + 1
    expect(layout.edges.length).toBe(31);

    // rounds: [pigtails(1), R32(16), R16(8), QF(4), SF(2), F(1)]
    expect(layout.rounds.length).toBe(6);
    expect(layout.rounds[0].length).toBe(1);
    expect(layout.rounds[1].length).toBe(16);
    expect(layout.rounds[5].length).toBe(1);

    // The target R32-1 aligns vertically with its single child PGT-1
    const map = new Map(layout.nodes.map(n => [n.id, n]));
    const edgesToR32_1 = layout.edges.filter(e => e.to === 'R32-1');
    expect(edgesToR32_1.length).toBe(1);
    const child = map.get(edgesToR32_1[0].from)!;
    const parent = map.get('R32-1')!;
    expect(parent.y).toBe(child.y);
  });

  it('2 pigtails → earliest round has 2, totals adjust', () => {
    const base = makeSingleElimBracket(32);
    const input = addPigtails(base, 2);
    const layout = buildLayout(input, { hGap: 160, vGap: 40 });

    expect(layout.nodes.length).toBe(33); // 31 + 2
    expect(layout.edges.length).toBe(32);

    expect(layout.rounds.length).toBe(6);
    expect(layout.rounds[0].length).toBe(2);
    expect(layout.rounds[1].length).toBe(16);
    expect(layout.rounds[5].length).toBe(1);
  });
});
