# DeskFlow

A role-based helpdesk/ticketing frontend built with React, Vite, and React Router. Three roles - **Employee**, **Agent**, and **Admin** - each get a dedicated dashboard built from a shared component library and design-token system.

## Tech stack

- **React 19** + **Vite** (dev server & build)
- **React Router v6** for client-side routing
- **react-hot-toast** for toast notifications
- **react-icons** for iconography
- **prop-types** for runtime prop validation
- **ESLint** (flat config) for linting
- Plain CSS with a token-based design system (no CSS framework)

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Available scripts

| Script            | Description                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the Vite dev server              |
| `npm run build`   | Production build to `dist/`            |
| `npm run preview` | Preview the production build locally   |
| `npm run lint`    | Run ESLint across the project          |

## Running with Docker

A multi-stage Dockerfile builds the app with Node and serves the static output with Nginx (SPA fallback routing is configured in `nginx.conf`).

```bash
docker build -t deskflow .
docker run -p 8080:80 deskflow
```

or, using Docker Compose:

```bash
docker compose up --build
```

The app is then available at `http://localhost:8080`.

## Project structure

```
src/
  components/
    ui/          # Generic, app-agnostic building blocks
      Button/    # Variant/size button
      Card/       # Content container
      Input/      # Labeled text input with validation state
      Select/     # Labeled dropdown with validation state
      StatusBadge/# Color-coded status/priority pill
      Table/      # Column-driven data table
      Loader/     # Spinner for async/loading states
      Toast/      # Toast notification provider + `showToast` helper
    layout/       # App-chrome components (Header, Sidebar, PageTitle)
    common/       # Shared layout primitives (Container)
  context/        # React context providers (ThemeContext)
  hooks/          # Custom hooks (useTheme)
  services/       # Data layer (currently mocked; swap for real API calls)
  layouts/        # Route-level layouts (PublicLayout, MainLayout)
  pages/
    admin/Dashboard
    agent/Dashboard
    employee/Dashboard
    auth/RoleSelection
    common/NotFound
  routes/         # Route table (AppRoutes)
  constants/      # Route path constants
  styles/         # Design tokens (variables.css), global styles, dashboard layout styles
```

Every component folder is self-contained (`Component.jsx`, `Component.css`, `index.js` barrel export), keeping a component's markup, styling, and public API together so it's easy to move, test, or delete in isolation.

## Design system

All colors, spacing, radii, typography, shadows, and transitions are defined as CSS custom properties in `src/styles/variables.css`, including a full dark-theme token set applied via `[data-theme="dark"]`. Components never hardcode raw values - they consume the tokens - so retheming the app means editing one file.

A light/dark toggle (top-right of the header) demonstrates the token system in practice: it flips the `data-theme` attribute on `<html>` via `ThemeContext` / `useTheme`, and the choice persists in `localStorage`.

## Reusable components

| Component     | Purpose                                                    |
| ------------- | ------------------------------------------------------------ |
| `Button`      | Primary interactive control (variants, sizes, full-width)     |
| `Card`        | Content container with optional title                         |
| `Input`       | Labeled text field with error/required states                 |
| `Select`      | Labeled dropdown with error/required states                    |
| `StatusBadge` | Color-coded status/priority pill                                |
| `Table`       | Column-driven, presentational data table                        |
| `Loader`      | Spinner for loading/async states                                 |
| `Toast`       | App-wide toast notifications (`showToast.success(...)`)          |

Each component has a JSDoc block above its definition describing its props and a usage example - see the source files under `src/components/ui`.

## Notes on the mock data layer

`src/services/ticketService.js` simulates an API with `setTimeout`-based delays so the dashboards can demonstrate real loading states via `Loader`. Swap its internals for real `fetch`/HTTP calls when a backend is available - consuming pages won't need to change since they only depend on the exported function signatures.
