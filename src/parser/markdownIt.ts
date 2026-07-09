import MarkdownIt from "markdown-it";

// Copied verbatim from learning-hub-backend/src/utils/markdownParser.ts —
// Phase 2 of the shared Markdown package migration. This exact config/
// comments must not change behavior for either app; see the Phase 1/2 plans
// at the learning-hub workspace root.
export const markdownIt = new MarkdownIt("commonmark", {
  // Never render raw HTML tags from note content — notes can come from
  // batch file uploads, not just trusted authors, so this is a real
  // injection boundary, not just a style choice.
  html: false,
  // Single newlines inside a paragraph stay soft-wrapped (CommonMark/GFM
  // behavior) rather than becoming a hard <br>, which is what most
  // Markdown authors expect from a blank-line-separated paragraph style.
  breaks: false,
  // Auto-link bare URLs and www.-style domains (e.g. a "Reference: <url>"
  // line with no [text](url) syntax) instead of leaving them as plain text.
  linkify: true,
  // Smart quotes only (straight -> curly). NOT the full typographer
  // "replacements" rule — that also rewrites "--" to an en dash, which
  // would corrupt CLI flags like `--save-dev` mentioned in plain prose
  // (outside backticks) on a programming-notes app.
  typographer: true,
  // The "commonmark" preset disables the "smartquotes" core rule outright —
  // the `typographer` option above does nothing unless it's re-enabled here.
}).enable(["table", "strikethrough", "linkify", "smartquotes"]);

export type MarkdownToken = ReturnType<typeof markdownIt.parse>[number];

export interface ParsedMarkdownSource {
  raw: string;
  cleaned: string;
  tokens: MarkdownToken[];
}

export function stripBoilerplate(input: string): string {
  return input
    .replace(/\[[^\]]*?Previous\].*?\n/g, "")
    .replace(/\[Home\].*?\n/g, "")
    .replace(/\[[^\]]*?Next >\].*?\n/g, "")
    .replace(/## Table of Contents.*?\n---/gs, "")
    .replace(/## Navigation.*/gs, "")
    .replace(/^---\s*\n/gm, "")
    .trim();
}

export function parseMarkdownSource(raw: string): ParsedMarkdownSource {
  const cleaned = stripBoilerplate(raw);
  return {
    raw,
    cleaned,
    tokens: markdownIt.parse(cleaned, {}),
  };
}
