// Copied verbatim from learning-hub-backend/src/constants/noteFormat.ts
// (guide.rules) — the note-format guide's authoring rules, as plain
// human-readable strings. Not the validator's enforcement logic (that stays
// in learning-hub-backend/src/utils/markdownValidator.ts for now; see the
// Phase 1 plan for what's intentionally NOT moved yet).
export const MARKDOWN_RULES = [
  "The first line MUST be the note title as the only level-1 heading: '# My Title'. This becomes the note's title unless you provide an explicit title when uploading.",
  "Use level-2 headings ('## ...') for SECTIONS. These build the in-note navigation menu, so give every major part its own '## ' heading.",
  "Use level-3 or deeper headings ('### ...', '#### ...') for nested content inside a section. Do not add another '# ...' heading inside the note.",
  "Fenced code blocks MUST declare a language after the backticks, e.g. ```sql, ```python, ```dockerfile, ```bash. This enables syntax highlighting.",
  "Tables use standard GitHub pipe syntax with a header separator row ('| --- | --- |').",
  "Use '**bold**', '*italic*', '`inline code`', and '[text](url)' for inline formatting. Lists use '-' (bullets) or '1.' (numbered).",
  "Do NOT include manual navigation lines, a manual 'Table of Contents', or a '## Navigation' footer. The platform generates navigation automatically.",
] as const;
