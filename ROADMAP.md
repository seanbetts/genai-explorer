 # Implementation Roadmap

 This document outlines the multi-phase plan to improve accessibility, performance, maintainability, and test coverage.

 ## Phase 1: Accessibility & Semantic HTML
 **Goal:** Make every interactive element keyboard‑ and screen‑reader‑friendly
 **Tasks:**
 - [x] Replace non‑semantic `<div onClick>` wrappers with `<button>` or `<a>` as appropriate.
 - [x] Add `tabIndex={0}` and `onKeyDown` handlers (Enter/Space) where a `<button>` is infeasible.
 - [x] Audit all icons and buttons for meaningful `aria-label` or `aria-labelledby`.
 - [x] Ensure focus rings appear on cards, tabs, back‑button, etc. (remove `focus:outline-none` where it hides native focus).
 - [x] Run Lighthouse/Axe to validate and fix any remaining violations.

 ## Phase 2: Data Fetching & State Lift
 **Goal:** Move JSON load off the client, prepare for live API
 **Tasks:**
 - [x] Import `landscape.json` directly in `app/page.tsx` (a server component by default) and cast it to `LandscapeData`.
 - [x] Pass the imported data as an `initialData` prop to `<AILandscape initialData={data} />` in `app/page.tsx`.
 - [x] Remove the JSON import and initial `useState(landscapeData…)` from the client component (`AILandscape`).
 - [x] Keep all interactivity client‑side under the existing `'use client'` directive in `AILandscape`.
 - [ ] (Optional) Encapsulate data retrieval in a `useLandscapeData()` hook stub for future API integration.

 ## Phase 3: Dead‑Code Removal & Type Safety
 **Goal:** Clean up unused state and strengthen types
 **Tasks:**
 - [x] Remove `expandedSections`, `toggleSection`, and related types (sections no longer collapsible).
 - [x] In `CategorySection`, accept a `CompanyCategory` enum instead of inferring from `title`.
 - [x] Remove string‑parsing logic for media categories; drive layout from a `category` prop.
 - [x] Tighten component prop types and add defaults where needed.

 ## Phase 4: Code Organization & DRY
 **Goal:** Collapse repetitive JSX and centralize configurations
 **Tasks:**
 - [x] Create `categoryConfig.ts` with an array of `{ key, label, icon, layout, columns?, showModelCount? }`.
 - [x] Refactor `LandscapeView` to map over `categoryConfig` instead of seven hard‑coded sections.
 - [x] Consolidate Tailwind constants into two modules: `styles/layout.ts` and `styles/theme.ts`.
 - [x] Centralize logo‑size presets into a `logoPresets.ts` lookup keyed by layout + category.

 ## Phase 5: Performance & Code‑Splitting
 **Goal:** Reduce initial bundle and avoid wasted recomputations
 **Tasks:**
 - Use `React.useMemo` around heavy derived data (e.g., categorization).
 - Dynamically import (`next/dynamic`) heavy components (ModelTable, CompanyDetail).
 - Audit `'use client'` directives and push static parts into server components.
 - Tighten `next.config.ts` `remotePatterns` to allowed domains only.

 ## Phase 6: UX Refinements & Skeletons
 **Goal:** Provide clear loading feedback and filtering
 **Tasks:**
 - Add skeleton loaders for `LandscapeView` hydration and `CompanyDetail` dynamic imports.
 - Implement a search/filter bar on the landscape overview.
 - Persist `currentView` and `activeTab` in the URL (query params) for deep‑links.

 ## Phase 7: Testing & CI
 **Goal:** Prevent regressions with unit, component, and e2e tests
 **Tasks:**
 - Unit tests (Jest+RTL) for utilities: `getCompaniesByModelCategory`, `getModelTabName`, pricing logic.
 - Component tests/snapshots for `CategorySection` and `CompanyCard`.
 - E2E test (Cypress or Playwright) to click a company, verify tab content, and return home.
 - Integrate lint, type checks, and tests in CI (GitHub Actions).

 ## Phase 8: Internationalization (Stretch)
 **Goal:** Prepare for multi‑locale support
 **Tasks:**
 - Extract all UI strings into an i18n JSON.
 - Integrate `next-i18next` or `react-intl` and replace date formatting.
 - Add language switcher in the header.

 ---
 ## Timeline & Prioritization
 - **Weeks 1–2:** Phase 1 & Phase 2 (Accessibility + Data Lift)
 - **Weeks 3–4:** Phase 3 & Phase 4 (Cleanup + DRY refactors)
 - **Weeks 5–6:** Phase 5 & Phase 6 (Performance & UX polish)
 - **Weeks 7–8:** Phase 7 & Phase 8 (Testing + i18n)

 By following this roadmap, we will evolve the codebase into an accessible, performant, maintainable, and test‑driven system ready for future growth.