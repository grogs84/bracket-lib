import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BracketSVG } from './BracketSVG';
import {
  buildLayout,
  partitionByWinnerTrees,
  type BracketInput
} from '@mgi/bracket-core';

const meta: Meta = {
  title: 'Partition/Inspect',
};
export default meta;

type Story = StoryObj;

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

function subsetInput(input: BracketInput, ids: string[]): BracketInput {
  const set = new Set(ids);
  return { matches: input.matches.filter(m => set.has(m.id)) };
}

export const SingleTree: Story = {
  render: () => {
    const input = useMemo(() => makeSingleElimBracket(8), []);
    const layout = useMemo(() => buildLayout(input, { hGap: 160, vGap: 80 }), [input]);
    const part = useMemo(() => partitionByWinnerTrees(input), [input]);

    return (
      <div style={{ padding: 16 }}>
        <h3>Partition summary (single tree)</h3>
        <pre style={{ background: '#f6f8fa', padding: 12 }}>
          {JSON.stringify(
            {
              championRoot: part.champion?.rootId ?? null,
              championSize: part.champion?.matches.length ?? 0,
              consolationRoots: part.consolation.map(c => c.rootId),
            },
            null,
            2
          )}
        </pre>
        <BracketSVG layout={layout} />
      </div>
    );
  },
};

export const TwoTreesChampionRendered: Story = {
  render: () => {
    const input: BracketInput = useMemo(() => ({
      matches: [
        { id: 'A1', winnerNextMatchId: 'AF' },
        { id: 'A2', winnerNextMatchId: 'AF' },
        { id: 'AF', winnerNextMatchId: null },
        { id: 'B1', winnerNextMatchId: 'BF' },
        { id: 'B2', winnerNextMatchId: 'BF' },
        { id: 'BF', winnerNextMatchId: null },
      ]
    }), []);

    const part = useMemo(() => partitionByWinnerTrees(input), [input]);
    const champInput = useMemo(() => (
      part.champion ? subsetInput(input, part.champion.matches) : { matches: [] }
    ), [input, part]);
    const layout = useMemo(() => (
      champInput.matches.length ? buildLayout(champInput, { hGap: 160, vGap: 80 }) : { nodes: [], edges: [], rounds: [] }
    ), [champInput]);

    return (
      <div style={{ padding: 16 }}>
        <h3>Two trees — champion selection</h3>
        <pre style={{ background: '#f6f8fa', padding: 12 }}>
          {JSON.stringify(
            {
              championRoot: part.champion?.rootId ?? null,
              championSize: part.champion?.matches.length ?? 0,
              consolationRoots: part.consolation.map(c => c.rootId),
            },
            null,
            2
          )}
        </pre>
        {layout.nodes.length ? <BracketSVG layout={layout} /> : <em>No champion tree determined</em>}
      </div>
    );
  },
};

export const LoserFeedMarksConsolation: Story = {
  render: () => {
    const input: BracketInput = useMemo(() => ({
      matches: [
        { id: 'UP1', winnerNextMatchId: 'UF' },
        { id: 'UP2', winnerNextMatchId: 'UF' },
        { id: 'UF', winnerNextMatchId: null },
        { id: 'C1', winnerNextMatchId: 'CF' },
        { id: 'C2', winnerNextMatchId: 'CF' },
        { id: 'CF', winnerNextMatchId: null },
        { id: 'X', winnerNextMatchId: null, loserNextMatchId: 'CF' },
      ]
    }), []);

    const part = useMemo(() => partitionByWinnerTrees(input), [input]);
    const champInput = useMemo(() => (
      part.champion ? subsetInput(input, part.champion.matches) : { matches: [] }
    ), [input, part]);
    const layout = useMemo(() => (
      champInput.matches.length ? buildLayout(champInput, { hGap: 160, vGap: 80 }) : { nodes: [], edges: [], rounds: [] }
    ), [champInput]);

    return (
      <div style={{ padding: 16 }}>
        <h3>Loser feed marks a tree as consolation</h3>
        <pre style={{ background: '#f6f8fa', padding: 12 }}>
          {JSON.stringify(
            {
              championRoot: part.champion?.rootId ?? null,
              championSize: part.champion?.matches.length ?? 0,
              consolationRoots: part.consolation.map(c => c.rootId),
            },
            null,
            2
          )}
        </pre>
        {layout.nodes.length ? <BracketSVG layout={layout} /> : <em>No champion tree determined</em>}
      </div>
    );
  },
};
