
# Open Code `/loop-goal` Prompt

Copy and paste the prompt below directly into Open Code:

```text
/loop-goal Convert this CLI project into a modern Dark-themed React + Vite + TypeScript web application using the existing palette logic in generatePalette.js.

Execute this transformation step-by-step in the following sequence:

Step 1: Setup & Dependencies
- Initialize React, Vite, TypeScript, and Tailwind CSS in the project root if not already configured.
- Ensure package.json has scripts for "dev", "build", and "test".
- Configure Tailwind CSS with dark mode enabled by default and dark UI base styles in index.css.

Step 2: Refactor Legacy Logic to TypeScript
- Read and analyze `generatePalette.js`.
- Port the exact color generation math and algorithms into `src/utils/paletteGenerator.ts` using strict TypeScript interfaces for Color, Palette, and Harmony types.
- Create `src/utils/colorUtils.ts` for clean color format conversions (HEX <-> RGB <-> HSL) and WCAG contrast calculations.
- Add unit tests verifying that `paletteGenerator.ts` outputs valid colors matching the legacy CLI results.

Step 3: Core UI & Layout Component
- Create a main dark-mode layout in `App.tsx` featuring a header, tool area, palette grid, and control panel.
- Implement `BaseColorPicker.tsx` allowing users to select or enter a seed color (via native color input, HEX text input, or harmony dropdown).

Step 4: Image Color Extraction Component
- Build `ImageColorPicker.tsx` which allows users to upload an image file (PNG/JPG/WebP).
- Render the image on an HTML5 `<canvas>`.
- Add interactive crosshair / eyedropper behavior on hover/click to sample the pixel color under the cursor and set it as the active base color for the palette generator.

Step 5: Palette Grid & Interactivity
- Build `PaletteDisplay.tsx` displaying the generated color palette swatches.
- Add features: lock/unlock individual slots, copy HEX code to clipboard on click with toast notification, and spacebar hotkey listener to regenerate unlocked colors.
- Build `ExportModal.tsx` to export palette as CSS variables, Tailwind config, or JSON.

Step 6: Verification
- Run type checking and build (`npm run build`) to ensure zero TypeScript errors.
- Confirm dark UI styling across all controls and components.
```
