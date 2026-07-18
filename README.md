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

## Current phase — Phase 5 (all planned phases complete)

- **Phase 1 — foundation.** Purely static/utility content:
  - `constants/` — the note-format guide (`NOTE_FORMAT_GUIDE`), its rules (`MARKDOWN_RULES`), the supported block list (`SUPPORTED_BLOCKS`), and the reference example note (`EXAMPLE_MARKDOWN`).
  - `prompts/` — the AI "generate a note" and "restructure a note" prompt templates (`AI_PROMPT`, `RESTRUCTURE_PROMPT`).
  - `slug/` — `slugify()`, the pure string-transform used for both URL slugs and heading-anchor ids. (Note/module slug *generation*, which is DB-counter/crypto/time dependent, stays in `learning-hub-backend`.)
  - `types/` — shared shapes for `Block`, `Inline`, `Section`, `TocEntry`, `ParsedNote`, `NoteFormatGuide`, and a `MarkdownValidationResult` diagnostic type.
- **Phase 2 — parser.** `parser/` — the `markdown-it` config (`markdownIt`, `parseMarkdownSource`, `stripBoilerplate`), the token-to-block converter (`tokensToBlocks`, `convertInline`), the section builder (`groupSections`), the TOC builder (`buildToc`), and the top-level orchestrator (`transformMarkdownTokens`).
- **Phase 3 — validator.** `validator/` — `validateMarkdownSource(raw, cleaned, tokens)` plus a `validateMarkdown(raw)` convenience entry point for callers with only raw text (used by the frontend's realtime validation). Fenced code blocks without a declared language are blocking errors; use the real language (` ```sql`, ` ```python`, etc.) or ` ```text` when no specific language applies.
- **Phase 4 — full backend replacement.** `learning-hub-backend` no longer has its own parser/transformer/validator implementation at all — it imports directly from this package. The Phase 2/3 compatibility wrapper files were deleted.
- **Phase 5 — formatter + editor integration.** `formatter/` — `formatMarkdown(raw)`, a whitespace/blank-line normalizer (blank line before/after headings and fenced code blocks, collapsed blank-line runs, trimmed trailing whitespace, exactly one trailing newline; fence-aware and idempotent). Never touches note content, only formatting conventions. The frontend's `MarkdownCodeEditor` wires `validateMarkdown()` into a real CodeMirror `linter()`/`lintGutter()` extension (inline gutter dots + hover tooltips + the native diagnostics panel) and adds an "Auto Fix" button that applies `formatMarkdown()`.

**Zero behavior change** was the goal through Phase 4 for all pre-existing code paths — `tests/parser.test.ts` and `tests/validator.test.ts` assert against the reference example note to catch drift. Phase 5 is genuinely new functionality (neither app had a formatter or CodeMirror linting before), covered by `tests/formatter.test.ts` (idempotency, fence-awareness, blank-line rules).

## Future roadmap

All originally planned phases are complete. Possible future work (not yet scoped): replacing each app's remaining direct format-guide fetch with this package's `NOTE_FORMAT_GUIDE` outright (currently additive only — the backend still serves its own `GET /api/note-format`), and richer per-line diagnostic positions once the validator tracks line numbers instead of aggregate message strings.

## Install

```bash
npm install github:vcdas123/learning-hub-markdown
```

## Usage

```ts
import { SUPPORTED_BLOCKS, NOTE_FORMAT_GUIDE, slugify } from "@learning-hub/markdown";
```
