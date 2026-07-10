import { test } from "node:test";
import assert from "node:assert/strict";
import { stripBoilerplate } from "../src/index.js";

// Product decision: never silently strip user content. stripBoilerplate now
// only trims leading/trailing whitespace — a note containing a manual
// "## Table of Contents"/"## Navigation" section (or anything else) keeps
// every bit of it; the validator surfaces a warning instead (see
// validateMarkdown.test.ts / getMarkdownDiagnostics.test.ts), it never
// deletes anything out from under the author.

test("preserves a manual Table of Contents / Navigation section instead of stripping it", () => {
  const raw =
    "# Title\n\n## Table of Contents\n\n- [Section](#section)\n---\n\n## Section\n\ntext\n\n## Navigation\n\n[Home]\n";
  const cleaned = stripBoilerplate(raw);
  assert.equal(cleaned, raw.trim());
});

// Regression test for a real data-loss bug: stripBoilerplate's old
// Navigation regex had no `^` line-start anchor, so "## Navigation"
// appearing mid-line (e.g. inside inline code in prose that merely
// *discusses* the feature) matched, and combined with the `s` (dotAll)
// flag, `.*` greedily deleted everything from that point to the end of the
// note — silently truncating real content on upload. Now that
// stripBoilerplate doesn't strip anything at all, this can't recur.
test("does not truncate the note when '## Navigation' appears mid-line, not as a real heading", () => {
  const raw =
    "# Title\n\n## Section One\n\nSome text mentioning `## Navigation` is a warning, inline.\n\n" +
    "## Section Two\n\nThis content must survive.\n";
  const cleaned = stripBoilerplate(raw);
  assert.equal(cleaned, raw.trim());
});

test("only trims leading/trailing whitespace", () => {
  assert.equal(stripBoilerplate("\n\n  # Title\n\ntext\n\n\n"), "# Title\n\ntext");
});
