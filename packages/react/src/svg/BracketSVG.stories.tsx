import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo } from 'react';
import { BracketSVG } from './BracketSVG';
import { buildLayout, type BracketInput } from '@mgi/bracket-core';

const meta: Meta<any> = {
  component: BracketSVG,
  title: 'Bracket/BracketSVG',
  argTypes: {
    // Controls for the Playground story
    size: { control: { type: 'select' }, options: [4, 8, 16, 32] },
    pigtails: { control: { type: 'select' }, options: [0, 1, 2] },
    hGap: { control: { type: 'number' } },
    vGap: { control: { type: 'number' } },
    boxWidth: { control: { type: 'number' } },
    boxHeight: { control: { type: 'number' } },
  },
};
export default meta;

type Story = StoryObj<any>;

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

// Helpers to add optional pigtails to feed R32
function addPigtails(base: BracketInput, count: number): BracketInput {
  if (count <= 0) return base;
  const matches = base.matches.slice();
  const makePt = (idx: number) => ({
    id: `PGT-${idx}`,
    winnerNextMatchId: `R32-${idx}`,
    left: { name: `PlayIn ${idx}A` },
    right: { name: `PlayIn ${idx}B` },
    roundHint: 'PT',
  });
  for (let i = 1; i <= Math.min(2, count); i++) matches.push(makePt(i));
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

// Playground story with interactive controls
export const Playground: Story = {
  args: {
    // custom controls consumed by render
    size: 32,
    pigtails: 0,
    // BracketSVG props
    boxWidth: 120,
    boxHeight: 40,
    hGap: 160,
    vGap: 40,
  } as any,
  render: (args: any) => {
    const input = useMemo(() => {
      const base = makeBracket(args.size);
      return addPigtails(base, args.pigtails);
    }, [args.size, args.pigtails]);

    const layout = useMemo(
      () => buildLayout(input, { hGap: args.hGap, vGap: args.vGap }),
      [input, args.hGap, args.vGap]
    );

    return (
      <div style={{ padding: 16 }}>
        <BracketSVG layout={layout} boxWidth={args.boxWidth} boxHeight={args.boxHeight} />
      </div>
    );
  },
};
