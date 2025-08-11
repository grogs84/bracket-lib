import React from 'react';
import type { Layout } from '@mgi/bracket-core';

export interface BracketSVGProps {
  layout: Layout;
  width?: number;
  height?: number;
  boxWidth?: number;
  boxHeight?: number;
  padding?: number;
  stroke?: string;
  fill?: string;
  textColor?: string;
}

export function BracketSVG(props: BracketSVGProps) {
  const {
    layout,
    width,
    height,
    boxWidth = 120,
    boxHeight = 40,
    padding = 20,
    stroke = '#888',
    fill = '#fff',
    textColor = '#222'
  } = props;

  const maxX = Math.max(0, ...layout.nodes.map(n => n.x));
  const maxY = Math.max(0, ...layout.nodes.map(n => n.y));
  const w = width ?? maxX + boxWidth + padding * 2;
  const h = height ?? maxY + boxHeight + padding * 2;

  const nodeMap = new Map(layout.nodes.map(n => [n.id, n]));

  const boxX = (x: number) => padding + x;
  const boxY = (y: number) => padding + y;

  const midY = (y: number) => boxY(y) + boxHeight / 2;
  const rightX = (x: number) => boxX(x) + boxWidth;
  const leftX = (x: number) => boxX(x);

  const titleId = 'bracket-title';
  
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-labelledby={titleId}>
      <title id={titleId}>Tournament bracket</title>
      <g stroke={stroke} fill="none" strokeWidth={2}>
        {layout.edges.map((e) => {
          const from = nodeMap.get(e.from)!;
          const to = nodeMap.get(e.to)!;
          // Polyline: from right edge → mid x → vertical → to left edge
          const x1 = rightX(from.x);
          const y1 = midY(from.y);
          const x4 = leftX(to.x);
          const y4 = midY(to.y);
          const mid = (x1 + x4) / 2;
          const d = `M ${x1},${y1} H ${mid} V ${y4} H ${x4}`;
          return <path key={`${e.from}->${e.to}`} d={d} />;
        })}
      </g>

      <g>
        {layout.nodes.map((n) => (
          <g key={n.id} transform={`translate(${boxX(n.x)}, ${boxY(n.y)})`}>
            <rect width={boxWidth} height={boxHeight} rx={6} ry={6} fill={fill} stroke={stroke} />
            <text
              x={boxWidth / 2}
              y={boxHeight / 2}
              dominantBaseline="middle"
              textAnchor="middle"
              fill={textColor}
              fontFamily="system-ui, sans-serif"
              fontSize={12}
            >
              {n.id}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
