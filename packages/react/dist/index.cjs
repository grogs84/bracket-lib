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
  BracketSVG: () => BracketSVG
});
module.exports = __toCommonJS(index_exports);

// src/svg/BracketSVG.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function BracketSVG(props) {
  const {
    layout,
    width,
    height,
    boxWidth = 120,
    boxHeight = 40,
    padding = 20,
    stroke = "#888",
    fill = "#fff",
    textColor = "#222"
  } = props;
  const maxX = Math.max(0, ...layout.nodes.map((n) => n.x));
  const maxY = Math.max(0, ...layout.nodes.map((n) => n.y));
  const w = width ?? maxX + boxWidth + padding * 2;
  const h = height ?? maxY + boxHeight + padding * 2;
  const nodeMap = new Map(layout.nodes.map((n) => [n.id, n]));
  const boxX = (x) => padding + x;
  const boxY = (y) => padding + y;
  const midY = (y) => boxY(y) + boxHeight / 2;
  const rightX = (x) => boxX(x) + boxWidth;
  const leftX = (x) => boxX(x);
  const titleId = "bracket-title";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: "img", "aria-labelledby": titleId, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { id: titleId, children: "Tournament bracket" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { stroke, fill: "none", strokeWidth: 2, children: layout.edges.map((e) => {
      const from = nodeMap.get(e.from);
      const to = nodeMap.get(e.to);
      const x1 = rightX(from.x);
      const y1 = midY(from.y);
      const x4 = leftX(to.x);
      const y4 = midY(to.y);
      const mid = (x1 + x4) / 2;
      const d = `M ${x1},${y1} H ${mid} V ${y4} H ${x4}`;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d }, `${e.from}->${e.to}`);
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: layout.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { transform: `translate(${boxX(n.x)}, ${boxY(n.y)})`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { width: boxWidth, height: boxHeight, rx: 6, ry: 6, fill, stroke }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "text",
        {
          x: boxWidth / 2,
          y: boxHeight / 2,
          dominantBaseline: "middle",
          textAnchor: "middle",
          fill: textColor,
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          children: n.id
        }
      )
    ] }, n.id)) })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BracketSVG
});
