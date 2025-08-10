import * as react_jsx_runtime from 'react/jsx-runtime';
import { Layout } from '@mgi/bracket-core';
export { Layout, LayoutEdge, LayoutNode } from '@mgi/bracket-core';

interface BracketSVGProps {
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
declare function BracketSVG(props: BracketSVGProps): react_jsx_runtime.JSX.Element;

export { BracketSVG };
