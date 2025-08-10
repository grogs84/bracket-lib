"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  buildLayout: () => buildLayout
});
module.exports = __toCommonJS(index_exports);
function buildLayout(input, opts = {}) {
  const hGap = opts.hGap ?? 160;
  const vGap = opts.vGap ?? 80;
  const matchesById = /* @__PURE__ */ new Map();
  for (const m of input.matches) {
    if (matchesById.has(m.id)) {
      throw new Error(`Duplicate match id: ${m.id}`);
    }
    matchesById.set(m.id, m);
  }
  if (matchesById.size === 0) {
    return { nodes: [], edges: [], rounds: [] };
  }
  const roots = input.matches.filter((m) => m.winnerNextMatchId === null);
  if (roots.length !== 1) {
    throw new Error(
      `Expected exactly 1 finals (winnerNextMatchId === null), got ${roots.length}`
    );
  }
  const root = roots[0];
  const children = /* @__PURE__ */ new Map();
  for (const m of input.matches) {
    const p = m.winnerNextMatchId;
    if (p !== null) {
      const arr = children.get(p) ?? [];
      arr.push(m);
      children.set(p, arr);
    }
  }
  for (const [k, arr] of children) {
    arr.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    children.set(k, arr);
  }
  const depthById = /* @__PURE__ */ new Map();
  const yRowById = /* @__PURE__ */ new Map();
  const edges = [];
  let nextLeafRow = 0;
  function dfsAssign(node, depth) {
    depthById.set(node.id, depth);
    const kids = children.get(node.id) ?? [];
    if (kids.length === 0) {
      const row = nextLeafRow++;
      yRowById.set(node.id, row);
      return row;
    }
    const childRows = [];
    for (const child of kids) {
      edges.push({ from: child.id, to: node.id, kind: "winner" });
      const r = dfsAssign(child, depth + 1);
      childRows.push(r);
    }
    const minR = Math.min(...childRows);
    const maxR = Math.max(...childRows);
    const myRow = (minR + maxR) / 2;
    yRowById.set(node.id, myRow);
    return myRow;
  }
  dfsAssign(root, 0);
  let maxDepth = 0;
  for (const d of depthById.values()) maxDepth = Math.max(maxDepth, d);
  const nodes = [];
  for (const [id, depth] of depthById) {
    const round = maxDepth - depth;
    const row = yRowById.get(id);
    nodes.push({
      id,
      x: round * hGap,
      y: row * vGap,
      round
    });
  }
  nodes.sort(
    (a, b) => a.round !== b.round ? a.round - b.round : a.y !== b.y ? a.y - b.y : a.id.localeCompare(b.id)
  );
  const rounds = Array.from({ length: maxDepth + 1 }, () => []);
  for (const n of nodes) {
    rounds[n.round].push(n.id);
  }
  return { nodes, edges, rounds };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildLayout
});
