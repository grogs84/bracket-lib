import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BracketSVG } from './BracketSVG';
import { buildLayout, type BracketInput } from '@mgi/bracket-core';

const meta: Meta<typeof BracketSVG> = {
  component: BracketSVG,
  title: 'Bracket/BracketSVG',
};
export default meta;

type Story = StoryObj<typeof BracketSVG>;

function makeBracket(n: number): BracketInput {
  const matches: BracketInput['matches'] = [];
  const rounds: string[][] = [];
  for (let count = n / 2; count >= 1; count = count / 2) {
    const label = count === 1 ? 'F' : count === 2 ? 'SF' : count === 4 ? 'QF' : count === 8 ? 'R16' : 'R32';
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

export const Four: Story = {
  render: () => {
    const layout = buildLayout(makeBracket(4), { hGap: 160, vGap: 80 });
    return <BracketSVG layout={layout} />;
  },
};

export const ThirtyTwo: Story = {
  render: () => {
    const layout = buildLayout(makeBracket(32), { hGap: 160, vGap: 40 });
    return <BracketSVG layout={layout} />;
  },
};
