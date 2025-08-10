import React from 'react';
import { BracketSVG } from '@mgi/bracket-react';
import { buildLayout, type BracketInput } from '@mgi/bracket-core';

const BRACKET_4: BracketInput = {
  matches: [
    { id: 'SF1', winnerNextMatchId: 'F', left: { name: 'A', seed: 1 }, right: { name: 'D', seed: 4 }, roundHint: 'SF' },
    { id: 'SF2', winnerNextMatchId: 'F', left: { name: 'B', seed: 2 }, right: { name: 'C', seed: 3 }, roundHint: 'SF' },
    { id: 'F', winnerNextMatchId: null, roundHint: 'F' }
  ]
};

export function App() {
  const layout = buildLayout(BRACKET_4, { hGap: 160, vGap: 80 });
  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Bracket Demo (Tiny 4-team)</h1>
      <BracketSVG layout={layout} />
    </div>
  );
}
