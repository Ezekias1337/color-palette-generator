
/loop-goal Revise `src/App.tsx` to add a SCSS variables export option to the `handleExport` function.

Execute this transformation step-by-step in the following sequence:

Step 1: Inspect Export Logic & Types

- Analyze `src/App.tsx` and identify the existing `handleExport` implementation, export modal/dropdown state, and export format types.
- Determine how color, typography, border-radius, and shadow state properties map into export string templates.

Step 2: Implement SCSS Export Generator

- Add a dedicated generator function or case handler (e.g., `generateScssExport`) to format variables with SCSS syntax (`$variable-name: value;`).
- Group output logically with standard SCSS block comments:
  - Color palettes (`$primary-*`, `$success-*`, `$warning-*`, `$error-*`, `$info-*`, `$neutral-*`)
  - Transparent variants (`$transparent-black-*` using `rgba($neutral-900, alpha)`)
  - Typography (`$header-*`, `$paragraph`, `$small`, `$extra-small`, `$font-family`)
  - Borders (`$border-radius`, `$surface-border-radius`)
  - Shadows & Glows (`$*-shadow`, `$*-glow` using `rgba(...)` references)

Step 3: Update UI & Export Options

- Add `"scss"` as an allowed export format selection in the export modal/controls in `src/App.tsx`.
- Wire `handleExport` to output and trigger download/copy for `.scss` files with the appropriate `text/x-scss` or `text/plain` MIME type.

Step 4: Verification

- Verify that selecting SCSS export produces syntactically valid SCSS code matching the target schema.
- Run type checking and build (`npm run build`) to ensure zero TypeScript errors.

/loop-goal Revise `src/App.tsx` to add a SCSS variables export option to the `handleExport` function.

Execute this transformation step-by-step in the following sequence:

Step 1: Inspect Export Logic & Types

- Analyze `src/App.tsx` and identify the existing `handleExport` implementation, export modal/dropdown state, and export format types.
- Determine how color, typography, border-radius, and shadow state properties map into export string templates.

Step 2: Implement SCSS Export Generator

- Add a dedicated generator function or case handler (e.g., `generateScssExport`) to format variables with SCSS syntax (`$variable-name: value;`).
- Group output logically with standard SCSS block comments:
  - Color palettes (`$primary-*`, `$success-*`, `$warning-*`, `$error-*`, `$info-*`, `$neutral-*`)
  - Transparent variants (`$transparent-black-*` using `rgba($neutral-900, alpha)`)
  - Typography (`$header-*`, `$paragraph`, `$small`, `$extra-small`, `$font-family`)
  - Borders (`$border-radius`, `$surface-border-radius`)
  - Shadows & Glows (`$*-shadow`, `$*-glow` using `rgba(...)` references)

Step 3: Update UI & Export Options

- Add `"scss"` as an allowed export format selection in the export modal/controls in `src/App.tsx`.
- Wire `handleExport` to output and trigger download/copy for `.scss` files with the appropriate `text/x-scss` or `text/plain` MIME type.

Step 4: Verification

- Verify that selecting SCSS export produces syntactically valid SCSS code matching the target schema.
- Run type checking and build (`npm run build`) to ensure zero TypeScript errors.
