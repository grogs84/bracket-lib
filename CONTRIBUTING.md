# Contributing to Bracket Lib

## Getting Started

This repository requires Node 20 and npm 10. Installs will fail fast if versions are wrong.

### Prerequisites

Ensure you have the correct Node.js and npm versions:
- Node.js 20.x
- npm 10.x

If you use nvm, you can install and use the correct version:
```bash
nvm use
```

### Quick Start

1. **Install dependencies and build packages**:
   ```bash
   npm ci
   ```

2. **Start the demo app** (Vite):
   ```bash
   npm run dev
   ```

3. **Start Storybook with live core development**:
   ```bash
   npm run dev:storybook
   ```
   This runs @mgi/bracket-core in watch mode and @mgi/bracket-react storybook concurrently.

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
- `npm run dev` — Start the Vite demo app
- `npm run dev:example` — Start the Vite demo app (alternative)
- `npm run dev:storybook` — Start Storybook with core watch mode concurrently
- `npm run build` — Build all packages
- `npm run test` — Run tests in all packages
- `npm run -ws test` — Alternative way to run all tests

### Testing Your Changes

1. Make changes to `packages/react/src/svg/BracketSVG.tsx` (e.g., modify the `<title>` text)
2. The demo should hot-reload and show your changes immediately
3. Verify tests still pass: `npm run -ws test`