# Agent Guidelines & Project Instructions

This project is transitioning from a Node.js CLI script (`generatePalette.js`) to a full-featured web UI built with React, Vite, TypeScript, and Tailwind CSS.

"You must strictly invoke tools using the provided native system function calls. Do NOT write <function_code> or pseudo-code blocks in your text responses."

---

## 1. Project Overview & Tech Stack

* **Framework:** React + Vite + TypeScript
* **Styling:** Tailwind CSS (Dark UI by default)
* **Legacy Core:** Color generation algorithms from `generatePalette.js`
* **Key Features:**
  * Interactive palette generator leveraging legacy logic
  * Base color picker input (HEX / HSL / RGB)
  * Image upload and canvas-based color picker (eyedropper / sampler)
  * Palette controls (lock individual colors, adjust harmony modes, copy formats)

---

## 2. Target Project Architecture

```text
color-palette-generator/
├── generatePalette.js          # Legacy CLI reference (do not delete until refactor is complete)
├── src/
│   ├── components/
│   │   ├── Header.tsx          # App header & global actions
│   │   ├── BaseColorPicker.tsx # Color picker & harmony controls
│   │   ├── ImageColorPicker.tsx# Canvas-based image upload & eyedropper
│   │   ├── PaletteDisplay.tsx  # Interactive palette grid & lock buttons
│   │   └── ExportModal.tsx     # Code export (CSS, Tailwind, JSON)
│   ├── utils/
│   │   ├── paletteGenerator.ts # Refactored legacy generatePalette.js logic in TS
│   │   ├── imageExtractor.ts   # Canvas pixel color sampling logic
│   │   └── colorUtils.ts       # HEX, RGB, HSL conversions and WCAG contrast
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Tailwind & dark mode base styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 3. Implementation Guidelines & Rules

Preserve Palette Logic: Port the core mathematical logic from generatePalette.js into clean, strongly-typed TypeScript utility functions in src/utils/paletteGenerator.ts.

Dark Theme Mandatory: The UI must be dark-themed by default (e.g., using Tailwind slate/zinc/gray dark backgrounds like #0f172a or #121212). Ensure text and control contrast pass WCAG AA standard.

Canvas Image Picker Requirements:

Allow users to upload common image formats (.png, .jpg, .webp).

Render the image to an HTML5 canvas element.

Provide an intuitive hover/click eyedropper tool to sample exact RGB/HEX pixels from the image to set as the active base color.

Interactive Palette Capabilities:

Spacebar hotkey to generate/refresh unlocked colors.

Lock/Unlock toggle per color slot.

One-click copy HEX string to clipboard with visual toast feedback.

No Regressions: Maintain type safety without using any. Ensure build (npm run build) runs clean without TypeScript or ESLint errors.

4. Commands & Workflow

```Shell
# Development server
npm run dev

# Type check and build bundle
npm run build

# Preview build artifact
npm run preview

# Run unit tests (Vitest)
npm run test
```
