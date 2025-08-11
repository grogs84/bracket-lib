import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BracketSVG } from './svg/BracketSVG';

const emptyLayout = { nodes: [], edges: [], rounds: [] };

describe('BracketSVG', () => {
  it('renders an svg without crashing', async () => {
    const el = document.createElement('div');
    const root = createRoot(el);
    
    // Wait for rendering to complete
    await new Promise<void>((resolve) => {
      root.render(<BracketSVG layout={emptyLayout as any} />);
      // Use a small timeout to allow React to render
      setTimeout(() => resolve(), 10);
    });
    
    expect(el.innerHTML).toContain('<svg');
    expect(el.innerHTML).toContain('role="img"');
    expect(el.innerHTML).toContain('Tournament bracket');
  });
});