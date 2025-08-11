# Contributing to Bracket Lib

## Local Development

This repository uses npm workspaces for development and includes a live-reload setup for faster iteration when working on the React components.

### Setup

1. **Bootstrap the project** (install dependencies and build packages):
   ```bash
   npm run bootstrap
   ```

2. **Start the demo application** with live-reload:
   ```bash
   npm run dev:example
   ```

3. **Start Storybook** (optional):
   ```bash
   npm run dev:storybook
   ```

### Development Workflow

With the setup above, you can:

1. **Edit React components** (e.g., `packages/react/src/svg/BracketSVG.tsx`)
2. **See changes instantly** in both the demo app and Storybook without manual rebuilds
3. **Run tests** across all packages:
   ```bash
   npm run -ws test
   ```

### How it works

The example app (`examples/react-vite`) uses Vite aliases to map `@mgi/bracket-react` directly to the source files in `packages/react/src`. This enables hot module replacement (HMR) so changes to the source code appear immediately in the browser.

### Available Scripts

From the root directory:

- `npm run bootstrap` — Install dependencies and build packages once
- `npm run dev:example` — Start the Vite demo app
- `npm run dev:storybook` — Start Storybook for the React package
- `npm run build` — Build all packages
- `npm run test` — Run tests in all packages
- `npm run -ws test` — Alternative way to run all tests

### Testing Your Changes

1. Make changes to `packages/react/src/svg/BracketSVG.tsx` (e.g., modify the `<title>` text)
2. The demo should hot-reload and show your changes immediately
3. Verify tests still pass: `npm run -ws test`