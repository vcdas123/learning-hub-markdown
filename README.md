# @learning-hub/markdown

Shared Markdown package for [Learning Hub](https://github.com/vcdas123) — the single source of truth for Markdown-related constants, prompts, slug helpers, and types used by both `learning-hub-frontend` and `learning-hub-backend`.

## Purpose

Without a shared package, the format guide, prompt templates, slug/anchor-id generation, and shared type shapes can silently drift between the frontend and backend. This package exists so both apps consume the same values instead of maintaining parallel copies.

## Architecture

```txt
learning-hub-frontend
        │
        ▼
@learning-hub/markdown
        ▲
        │
learning-hub-backend
```

Both apps install this package and import from it. Eventually every Markdown rule, parser, validator, and guide will live here.

## Current phase — Phase 1 (foundation only)

**This package intentionally does NOT contain the Markdown parser or validator yet.** Phase 1 only establishes the package and moves the lowest-risk, purely static/utility content:

- `constants/` — the note-format guide (`NOTE_FORMAT_GUIDE`), its rules (`MARKDOWN_RULES`), the supported block list (`SUPPORTED_BLOCKS`), and the reference example note (`EXAMPLE_MARKDOWN`).
- `prompts/` — the AI "generate a note" and "restructure a note" prompt templates (`AI_PROMPT`, `RESTRUCTURE_PROMPT`).
- `slug/` — `slugify()`, the pure string-transform used for both URL slugs and heading-anchor ids. (Note/module slug *generation*, which is DB-counter/crypto/time dependent, stays in `learning-hub-backend` for now.)
- `types/` — shared shapes for `Block`, `Inline`, `Section`, `TocEntry`, `ParsedNote`, `NoteFormatGuide`, and a newly-designed `MarkdownValidationResult` diagnostic type (no equivalent existed in either app before this package).

Neither app has switched its runtime behavior to use this package yet — it's installed and import-verified only. **Zero behavior change** was the explicit goal of this phase.

## Future roadmap

Once both apps successfully consume this package as a dependency, later phases will migrate (in order):

1. Parser (`markdown-it` config)
2. Validator
3. Format guide (replacing each app's own copy with this package's)
4. Realtime frontend validation
5. Formatter
6. CodeMirror diagnostics

This incremental approach minimizes risk and keeps both applications stable throughout the migration. See `Shared Markdown Package Plan.md` and `Phase 1 - Create Shared Markdown Repository.md` in the `learning-hub` workspace root for the full plan.

## Install

```bash
npm install github:vcdas123/learning-hub-markdown
```

## Usage

```ts
import { SUPPORTED_BLOCKS, NOTE_FORMAT_GUIDE, slugify } from "@learning-hub/markdown";
```
