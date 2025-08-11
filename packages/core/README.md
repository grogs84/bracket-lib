# @mgi/bracket-core

Core bracket layout algorithm for single-elimination tournaments.

## Installation

```bash
npm install @mgi/bracket-core
```

## Quick Start

```typescript
import { buildLayout } from '@mgi/bracket-core';

// Define your bracket structure
const bracketInput = {
  matches: [
    // Final
    { id: 'final', winnerNextMatchId: null, roundHint: 'Final' },
    // Semifinals
    { id: 'semi1', winnerNextMatchId: 'final', roundHint: 'Semifinal' },
    { id: 'semi2', winnerNextMatchId: 'final', roundHint: 'Semifinal' },
    // Quarterfinals
    { id: 'qf1', winnerNextMatchId: 'semi1', roundHint: 'Quarterfinal' },
    { id: 'qf2', winnerNextMatchId: 'semi1', roundHint: 'Quarterfinal' },
    { id: 'qf3', winnerNextMatchId: 'semi2', roundHint: 'Quarterfinal' },
    { id: 'qf4', winnerNextMatchId: 'semi2', roundHint: 'Quarterfinal' },
  ]
};

// Generate layout coordinates
const layout = buildLayout(bracketInput);

console.log(layout);
// Output:
// {
//   nodes: [
//     { id: 'final', x: 3, y: 1.5, roundHint: 'Final' },
//     { id: 'semi1', x: 2, y: 0.75, roundHint: 'Semifinal' },
//     // ... more nodes with x,y coordinates
//   ],
//   edges: [
//     { from: 'semi1', to: 'final' },
//     { from: 'semi2', to: 'final' },
//     // ... more edges
//   ]
// }
```

## API

### `buildLayout(input: BracketInput): Layout`

Takes a bracket structure and returns positioned nodes and edges for rendering.

#### Types

```typescript
interface BracketInput {
  matches: Match[];
}

interface Match {
  id: string;
  winnerNextMatchId: string | null;
  roundHint?: string;
  participants?: Participant[];
}

interface Participant {
  id: string;
  name?: string;
  seed?: number;
}

interface Layout {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
}

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  roundHint?: string;
  participants?: Participant[];
}

interface LayoutEdge {
  from: string;
  to: string;
}
```

The algorithm produces deterministic layouts where:
- `x` represents the round (0 = earliest, higher = later)
- `y` represents vertical position (0 = top)
- Nodes are positioned so parent matches appear between their children
