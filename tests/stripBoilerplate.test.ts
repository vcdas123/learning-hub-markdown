import { test } from "node:test";
import assert from "node:assert/strict";
import { stripBoilerplate } from "../src/index.js";

test("strips an actual auto-generated Navigation footer at the end of a note", () => {
  const raw = "# Title\n\n## Section\n\ntext\n\n## Navigation\n\n[Home] · [Previous] · [Next >]\n";
  const cleaned = stripBoilerplate(raw);
  assert.ok(!cleaned.includes("## Navigation"));
  assert.ok(cleaned.includes("## Section"));
});

test("strips an actual auto-generated Table of Contents block", () => {
  const raw = "# Title\n\n## Table of Contents\n\n- [Section](#section)\n---\n\n## Section\n\ntext\n";
  const cleaned = stripBoilerplate(raw);
  assert.ok(!cleaned.includes("## Table of Contents"));
  assert.ok(cleaned.includes("## Section"));
});

// Regression test for a real data-loss bug: stripBoilerplate's Navigation
// regex previously had no `^` line-start anchor, so "## Navigation"
// appearing mid-line (e.g. inside inline code in prose that merely
// *discusses* the feature) matched, and combined with the `s` (dotAll) flag,
// `.*` greedily deleted everything from that point to the end of the note —
// silently truncating real content on upload.
test("does not truncate the note when '## Navigation' appears mid-line, not as a real heading", () => {
  const raw =
    "# Title\n\n## Section One\n\nSome text mentioning `## Navigation` is a warning, inline.\n\n" +
    "## Section Two\n\nThis content must survive.\n";
  const cleaned = stripBoilerplate(raw);
  assert.ok(cleaned.includes("## Section Two"));
  assert.ok(cleaned.includes("This content must survive."));
});

test("does not truncate the note when '## Table of Contents' appears mid-line, not as a real heading", () => {
  const raw =
    "# Title\n\n## Section One\n\nSome text mentioning `## Table of Contents` is a warning, inline.\n\n" +
    "## Section Two\n\nThis content must survive.\n";
  const cleaned = stripBoilerplate(raw);
  assert.ok(cleaned.includes("## Section Two"));
  assert.ok(cleaned.includes("This content must survive."));
});
