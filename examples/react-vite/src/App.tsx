import React, { useMemo, useState } from 'react';
import { BracketSVG } from '@mgi/bracket-react';
import { buildLayout, type BracketInput } from '@mgi/bracket-core';

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
  // Build round IDs from earliest to final
  for (let count = n / 2; count >= 1; count = count / 2) {
    const label = labelForCount(count);
    rounds.push(Array.from({ length: count }, (_, i) => `${label}-${i + 1}`));
  }
  // Build matches and winner edges
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

function addPigtails(base: BracketInput, count: number): BracketInput {
  if (count <= 0) return base;
  const matches = base.matches.slice();
  const makePt = (idx: number) => ({
    id: `PGT-${idx}`,
    winnerNextMatchId: `R32-${idx}`,
    left: { name: `PlayIn ${idx}A` },
    right: { name: `PlayIn ${idx}B` },
    roundHint: 'PT'
  });
  for (let i = 1; i <= Math.min(2, count); i++) matches.push(makePt(i));
  return { matches };
}

export function App() {
  const [size, setSize] = useState(32);
  const [pigtails, setPigtails] = useState(0);
  const input = useMemo<BracketInput>(() => {
    const base = makeSingleElimBracket(size);
    return pigtails > 0 ? addPigtails(base, pigtails) : base;
  }, [size, pigtails]);
  const layout = useMemo(() => buildLayout(input, { hGap: 160, vGap: size >= 32 ? 40 : 80 }), [input, size]);
  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Bracket Demo ({size}-team{pigtails > 0 ? ` + ${pigtails} pigtail${pigtails > 1 ? 's' : ''}` : ''})</h1>
      <div style={{ marginBottom: 12, display: 'flex', gap: 16 }}>
        <label>
          Size:
          <select style={{ marginLeft: 8 }} value={size} onChange={e => setSize(parseInt(e.target.value, 10))}>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={32}>32</option>
          </select>
        </label>
        <label>
          Pigtails:
          <select style={{ marginLeft: 8 }} value={pigtails} onChange={e => setPigtails(parseInt(e.target.value, 10))}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
      </div>
      <BracketSVG layout={layout} />
    </div>
  );
}
