# Next Steps

This document enumerates concrete, high‑signal tasks with clear problems, proposed solutions, expected outcomes, and acceptance criteria.

## 1) Storybook: CI test runner integration parity with local
- Problem: We run the Storybook test runner in CI, but it relies on starting Storybook manually; we want reliable, faster runs.
- Solution:
  - Keep the `storybook-tests` job, ensure `--watch=false` is used and add retries to `wait-on`.
  - Optionally switch to `storybook build` + `@storybook/test-runner` against a static server for speed.
- Expected Outcome: Stable PR feedback within ~2–3 minutes for the Storybook job.
- Acceptance Criteria:
  - CI green on PRs from dev and main.
  - Flake rate <1% across 10 reruns.

## 2) React package: Add labels and props for display polish
- Problem: Boxes show only match IDs; hard to read for non‑developers.
- Solution:
  - Extend `BracketSVG` props with optional label renderers: `renderMatchLabel(node)`, `renderSeed(participant)`.
  - Provide defaults that render round hints (e.g., PT, R32, R16) and participant seeds/names when present.
- Expected Outcome: Bracket is human‑readable and useful out of the box.
- Acceptance Criteria:
  - A story demonstrating labels for 4, 16, and 32 entries.
  - Example app shows seeds/names in first round, IDs for later rounds.

## 3) Core: Input validation and helpful diagnostics
- Problem: Invalid graphs (orphan nodes, cycles, duplicate IDs) can produce confusing layouts.
- Solution:
  - Add `validateInput(input)` that checks: unique IDs, edges point to existing matches or null, no winnerNextMatchId cycles, one final.
  - Optionally run in `buildLayout` behind a flag (`validate: true` in options) for dev builds; expose separately.
- Expected Outcome: Earlier, clearer errors; easier adoption.
- Acceptance Criteria:
  - Unit tests covering invalid graphs; helpful error messages.
  - Example app shows a console warning if validation fails.

## 4) Core: “byes” convenience helper
- Problem: Users commonly need 30/31/33/34 entrants; shaping byes/pigtails is repetitive.
- Solution:
  - Provide `generateSingleElim({ entrants, pigtails })` returning BracketInput, handling byes and pigtails mapping to R32.
- Expected Outcome: Faster onboarding, fewer mistakes.
- Acceptance Criteria:
  - Tests for 30/31/33/34 ensuring counts and connectivity.
  - Story that toggles entrants/pigtails and remains deterministic.

## 5) Example App: Print/export friendly view
- Problem: Wide brackets (32 with pigtails) are hard to share.
- Solution:
  - Add a toggle to hide pigtails for print/export. Add a button to download SVG (inline serialization) and PNG (via canvas).
- Expected Outcome: Shareable bracket images.
- Acceptance Criteria:
  - Clicking “Export PNG” downloads a file that visually matches the SVG.

## 6) Docs: Public API and data contract
- Problem: Users need a concise guide to the data shape and layout options.
- Solution:
  - Write README sections for core and react packages: types, buildLayout options, coordinates semantics, examples.
- Expected Outcome: Self‑serve usage without reading code.
- Acceptance Criteria:
  - README in `packages/core` and `packages/react` with runnable snippets.

## 7) Release automation
- Problem: Manual publishing is error‑prone.
- Solution:
  - Add changesets or semantic‑release. Publish on tag, scoped to workspaces.
- Expected Outcome: Versioned releases with changelogs.
- Acceptance Criteria:
  - Creating a Git tag triggers build and publish to npm (dry‑run acceptable initially).

## 8) Performance pass for very large brackets (>64)
- Problem: Layout and SVG size can grow quickly.
- Solution:
  - Virtualize columns (render only visible rounds). Optionally add zoom/pan controls.
- Expected Outcome: Usable UX up to 128 teams in demo/story.
- Acceptance Criteria:
  - Story that loads 64/128 without jank; FPS >= 50 on a mid‑range laptop.

## 9) Accessibility and testing
- Problem: SVG lacks accessible names and keyboard support.
- Solution:
  - Add ARIA roles/labels, focus rings, and test using Axe in the Storybook test runner.
- Expected Outcome: Basic accessibility conformance.
- Acceptance Criteria:
  - No critical Axe violations in Storybook tests; keyboard focus reaches boxes.

## 10) Optional: Double‑elimination support (scoped)
- Problem: Initial goal mentions double‑elimination; current core is single‑elim.
- Solution:
  - Define a minimal data contract for losers bracket edges (e.g., `loserNextMatchId`). Build a separate layout mode.
- Expected Outcome: Early prototype of double‑elim layout for small sizes (<=8).
- Acceptance Criteria:
  - Tests for 4/8 double‑elim connectivity; a Storybook demo rendering both brackets side‑by‑side.
