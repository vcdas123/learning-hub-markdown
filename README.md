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

## Current phase — Phase 2 (parser moved; validator still pending)

**This package does NOT contain the Markdown validator yet.** Phases completed so far:

- **Phase 1 — foundation.** Purely static/utility content:
  - `constants/` — the note-format guide (`NOTE_FORMAT_GUIDE`), its rules (`MARKDOWN_RULES`), the supported block list (`SUPPORTED_BLOCKS`), and the reference example note (`EXAMPLE_MARKDOWN`).
  - `prompts/` — the AI "generate a note" and "restructure a note" prompt templates (`AI_PROMPT`, `RESTRUCTURE_PROMPT`).
  - `slug/` — `slugify()`, the pure string-transform used for both URL slugs and heading-anchor ids. (Note/module slug *generation*, which is DB-counter/crypto/time dependent, stays in `learning-hub-backend`.)
  - `types/` — shared shapes for `Block`, `Inline`, `Section`, `TocEntry`, `ParsedNote`, `NoteFormatGuide`, and a `MarkdownValidationResult` diagnostic type.
- **Phase 2 — parser.** `parser/` — the `markdown-it` config (`markdownIt`, `parseMarkdownSource`, `stripBoilerplate`), the token-to-block converter (`tokensToBlocks`, `convertInline`), the section builder (`groupSections`), the TOC builder (`buildToc`), and the top-level orchestrator (`transformMarkdownTokens`). `learning-hub-backend` keeps its own `markdownParser.ts`/`markdownTransformer.ts` as thin compatibility wrappers re-exporting from this package — every other backend module continues importing from those same file paths unchanged.

Neither app has switched its own *validator* to use this package yet, and the frontend still doesn't consume the parser (it never ran its own copy — only the backend parses raw Markdown). **Zero behavior change** remains the goal at every phase — a parser regression test (`tests/parser.test.ts`) parses the reference example note and asserts on title/sections/subsections/TOC/code-block-language to catch drift.

## Future roadmap

1. ~~Parser (`markdown-it` config)~~ — done, Phase 2.
2. Validator.
3. Format guide fully replacing each app's own copy (currently additive only).
4. Realtime frontend validation.
5. Formatter.
6. CodeMirror diagnostics.

This incremental approach minimizes risk and keeps both applications stable throughout the migration. See `Shared Markdown Package Plan.md` and `Phase 1 - Create Shared Markdown Repository.md` in the `learning-hub` workspace root for the full plan.

## Install

```bash
npm install github:vcdas123/learning-hub-markdown
```

## Usage

```ts
import { SUPPORTED_BLOCKS, NOTE_FORMAT_GUIDE, slugify } from "@learning-hub/markdown";
```
