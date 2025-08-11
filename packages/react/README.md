# @mgi/bracket-react

React SVG components for rendering tournament brackets.

## Installation

```bash
npm install @mgi/bracket-react @mgi/bracket-core
```

## Quick Start

```tsx
import React from 'react';
import { BracketSVG } from '@mgi/bracket-react';
import { buildLayout } from '@mgi/bracket-core';

const bracketInput = {
  matches: [
    { id: 'final', winnerNextMatchId: null, roundHint: 'Final' },
    { id: 'semi1', winnerNextMatchId: 'final', roundHint: 'Semifinal' },
    { id: 'semi2', winnerNextMatchId: 'final', roundHint: 'Semifinal' },
    { id: 'qf1', winnerNextMatchId: 'semi1', roundHint: 'Quarterfinal' },
    { id: 'qf2', winnerNextMatchId: 'semi1', roundHint: 'Quarterfinal' },
    { id: 'qf3', winnerNextMatchId: 'semi2', roundHint: 'Quarterfinal' },
    { id: 'qf4', winnerNextMatchId: 'semi2', roundHint: 'Quarterfinal' },
  ]
};

function App() {
  const layout = buildLayout(bracketInput);
  
  return (
    <BracketSVG
      layout={layout}
      width={800}
      height={400}
    />
  );
}

export default App;
```

## API

### `BracketSVG`

Main component for rendering brackets as SVG.

#### Props

```typescript
interface BracketSVGProps {
  layout: Layout;           // From buildLayout()
  width?: number;           // SVG width (default: 800)
  height?: number;          // SVG height (default: 600)
  hGap?: number;            // Horizontal gap between rounds (default: 120)
  vGap?: number;            // Vertical gap between matches (default: 60)
  boxWidth?: number;        // Match box width (default: 100)
  boxHeight?: number;       // Match box height (default: 40)
  strokeColor?: string;     // Line color (default: '#333')
  strokeWidth?: number;     // Line width (default: 2)
  fillColor?: string;       // Box fill color (default: '#f9f9f9')
  textColor?: string;       // Text color (default: '#333')
}
```

#### Styling

The component renders pure SVG elements. You can customize appearance via props or CSS:

```css
.bracket-svg text {
  font-family: Arial, sans-serif;
  font-size: 12px;
}

.bracket-svg rect {
  rx: 4; /* rounded corners */
}
```

## Examples

### With Custom Colors

```tsx
<BracketSVG
  layout={layout}
  strokeColor="#0066cc"
  fillColor="#e6f3ff"
  textColor="#003d7a"
/>
```

### Responsive Sizing

```tsx
<BracketSVG
  layout={layout}
  width={Math.min(1200, window.innerWidth - 40)}
  height={600}
/>
```

## Requirements

- React 18.2.0+
- React DOM 18.2.0+
