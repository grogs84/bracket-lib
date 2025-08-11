# Roadmap

This roadmap captures the likely evolution of the bracket library, from core capabilities to polish and release.

## Phase 1: Solid single‑elimination core (Now)
- Deterministic layout for single‑elim brackets from a minimal graph contract. ✅
- React SVG renderer that is small and predictable. ✅
- Example app and Storybook for visual validation. ✅
- CI for build/test and Storybook build; Storybook test runner in CI. ✅

## Phase 2: Developer ergonomics and UX polish
- Input validation utilities with actionable errors.
- Convenience generators for byes/pigtails; seed helpers.
- BracketSVG labeling and theming props (typography, colors, box sizes).
- Export: download SVG/PNG; print-friendly toggles (hide pigtails/labels).
- Docs: usage recipes, real-data converter examples.

## Phase 3: Scale and performance
- Handle 64–128 team layouts smoothly (virtualized columns, zoom/pan).
- Layout options: custom horizontal/vertical gaps per round; column grouping (Play‑in, R32, R16, ...).
- Accessibility: ARIA, keyboard nav, Axe checks in Storybook tests.

## Phase 4: Feature expansion
- Double‑elimination (MVP): extend data contract (loserNextMatchId), separate layout pass, combined renderer view.
- Match metadata surfaces: scores, times, locations as optional overlays.
- Theming presets and CSS‑in‑SVG variables to enable light/dark themes.

## Phase 5: Tooling and release
- Release automation (changesets or semantic‑release) for both packages.
- Versioned docs site (optional GitHub Pages with Storybook or Docusaurus linking to examples).
- Example integrations (Next.js, static SSR export).

## Guiding principles
- Small, boring, debuggable: pure TS core; deterministic; minimal required props.
- Data-first: core takes a simple graph; rendering is optional and pluggable.
- Tests before features: unit tests for structure and determinism; stories for visual guardrails.
- Opt-in complexity: advanced features come as separate helpers or flags.
