import { test } from "node:test";
import assert from "node:assert/strict";
import { getMarkdownDiagnostics, EXAMPLE_MARKDOWN } from "../src/index.js";

test("the reference example note has no diagnostics", () => {
  assert.deepEqual(getMarkdownDiagnostics(EXAMPLE_MARKDOWN), []);
});

test("anchors a missing-language code fence warning to its actual line, not line 1", () => {
  const raw = "# Title\n\n## Section\n\ntext\n\n```\nno language here\n```\n";
  const diagnostics = getMarkdownDiagnostics(raw);
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].severity, "warning");
  assert.equal(diagnostics[0].line, 7); // the ``` opening fence line
});

test("anchors a manual Table of Contents warning to its actual line", () => {
  const raw = "# Title\n\n## Table of Contents\n\n- link\n\n## Section\n\ntext\n";
  const diagnostics = getMarkdownDiagnostics(raw);
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].line, 3);
});

test("missing title and missing section are both anchored near line 1, not to unrelated content", () => {
  const raw = "Just a paragraph, no headings at all.\n\nMore text here.\n";
  const diagnostics = getMarkdownDiagnostics(raw);
  assert.equal(diagnostics.length, 2);
  assert.ok(diagnostics.every((d) => d.severity === "error" && d.line === 1));
});

test("an empty note is a single error on line 1", () => {
  assert.deepEqual(getMarkdownDiagnostics("   \n\n "), [
    { message: "The note is empty.", severity: "error", line: 1 },
  ]);
});
