# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-01-XX

### Added
- **Core Package (`@mgi/bracket-core`)**
  - Initial release of bracket layout algorithm
  - `buildLayout` function for generating tournament bracket layouts
  - Support for single elimination, double elimination, and round-robin tournaments
  - TypeScript definitions for all layout types and configurations
  - Comprehensive API with `Layout`, `LayoutOptions`, `Match`, and `Participant` interfaces

- **React Package (`@mgi/bracket-react`)**
  - Initial release of React SVG bracket renderer
  - `BracketSVG` component for rendering tournament brackets
  - Customizable styling through CSS variables and custom classes
  - Support for all layout types from the core package
  - TypeScript-first development with full type safety

- **Documentation**
  - Complete API documentation for both packages
  - Quickstart guides with usage examples
  - Contributing guidelines with local development workflow
  - Example React application demonstrating integration

- **Development Infrastructure**
  - npm workspaces monorepo setup
  - TypeScript strict configuration
  - Vitest testing framework
  - ESM and CommonJS builds with tsup
  - Hot module reloading for development

### Technical Details
- Dual package exports (ESM/CommonJS) for maximum compatibility
- React 18.2.0+ peer dependency support
- Comprehensive TypeScript definitions included
- Zero runtime dependencies in core package
- Tree-shakeable exports for optimal bundle sizes

[0.1.0]: https://github.com/your-org/bracket-lib/releases/tag/v0.1.0
