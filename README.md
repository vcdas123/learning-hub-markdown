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

## Current phase — Phase 3 (validator moved; frontend realtime validation next)

Phases completed so far:

- **Phase 1 — foundation.** Purely static/utility content:
  - `constants/` — the note-format guide (`NOTE_FORMAT_GUIDE`), its rules (`MARKDOWN_RULES`), the supported block list (`SUPPORTED_BLOCKS`), and the reference example note (`EXAMPLE_MARKDOWN`).
  - `prompts/` — the AI "generate a note" and "restructure a note" prompt templates (`AI_PROMPT`, `RESTRUCTURE_PROMPT`).
  - `slug/` — `slugify()`, the pure string-transform used for both URL slugs and heading-anchor ids. (Note/module slug *generation*, which is DB-counter/crypto/time dependent, stays in `learning-hub-backend`.)
  - `types/` — shared shapes for `Block`, `Inline`, `Section`, `TocEntry`, `ParsedNote`, `NoteFormatGuide`, and a `MarkdownValidationResult` diagnostic type.
- **Phase 2 — parser.** `parser/` — the `markdown-it` config (`markdownIt`, `parseMarkdownSource`, `stripBoilerplate`), the token-to-block converter (`tokensToBlocks`, `convertInline`), the section builder (`groupSections`), the TOC builder (`buildToc`), and the top-level orchestrator (`transformMarkdownTokens`). `learning-hub-backend` keeps its own `markdownParser.ts`/`markdownTransformer.ts` as thin compatibility wrappers re-exporting from this package — every other backend module continues importing from those same file paths unchanged.
- **Phase 3 — validator.** `validator/` — `validateMarkdownSource(raw, cleaned, tokens)` (same signature as the backend's original) plus a new convenience `validateMarkdown(raw)` that runs `parseMarkdownSource` + validation in one call for callers (like a frontend editor) that only have raw text. `learning-hub-backend`'s `markdownValidator.ts` becomes a compatibility wrapper too. The frontend now uses `validateMarkdown()` for realtime validation as the user types (additive UI feedback only — the backend's own validation on save/submit is unchanged and remains authoritative).

**Zero behavior change** remains the goal at every phase for existing code paths — a parser regression test (`tests/parser.test.ts`) and a validator regression test (`tests/validator.test.ts`) assert against the reference example note to catch drift.

## Future roadmap

1. ~~Parser (`markdown-it` config)~~ — done, Phase 2.
2. ~~Validator~~ — done, Phase 3.
3. Format guide fully replacing each app's own copy (currently additive only).
4. Replace the backend's own parser entirely with this package (retire the compatibility wrappers).
5. Formatter, CodeMirror diagnostics, auto-fix.

This incremental approach minimizes risk and keeps both applications stable throughout the migration. See `Shared Markdown Package Plan.md` and `Phase 1 - Create Shared Markdown Repository.md` in the `learning-hub` workspace root for the full plan.

## Install

```bash
npm install github:vcdas123/learning-hub-markdown
```

## Usage

```ts
import { SUPPORTED_BLOCKS, NOTE_FORMAT_GUIDE, slugify } from "@learning-hub/markdown";
```
