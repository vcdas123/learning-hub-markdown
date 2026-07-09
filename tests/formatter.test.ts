import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMarkdown, EXAMPLE_MARKDOWN } from "../src/index.js";

test("formatting the already-clean example markdown is idempotent", () => {
  const once = formatMarkdown(EXAMPLE_MARKDOWN);
  const twice = formatMarkdown(once);
  assert.equal(once, twice);
});

test("inserts blank lines around headings that are missing them", () => {
  const raw = "# Title\nIntro text.\n## Section\nBody text.";
  const formatted = formatMarkdown(raw);
  assert.equal(
    formatted,
    "# Title\n\nIntro text.\n\n## Section\n\nBody text.\n",
  );
});

test("inserts blank lines around a fenced code block missing them", () => {
  const raw = "# Title\n\n## Section\ntext before\n```js\ncode\n```\ntext after\n";
  const formatted = formatMarkdown(raw);
  assert.equal(
    formatted,
    "# Title\n\n## Section\n\ntext before\n\n```js\ncode\n```\n\ntext after\n",
  );
});

test("collapses 3+ blank lines down to 1 and trims trailing whitespace", () => {
  const raw = "# Title   \n\n\n\n## Section\t\n\ntext\n\n\n";
  const formatted = formatMarkdown(raw);
  assert.equal(formatted, "# Title\n\n## Section\n\ntext\n");
});

test("never leaves a leading or trailing blank line, always ends with exactly one newline", () => {
  const raw = "\n\n# Title\n\n## Section\n\ntext\n\n\n";
  const formatted = formatMarkdown(raw);
  assert.equal(formatted.startsWith("\n"), false);
  assert.ok(formatted.endsWith("\n") && !formatted.endsWith("\n\n"));
});

test("does not insert a blank line inside a fenced code block even if its content looks like a heading", () => {
  const raw = "# Title\n\n## Section\n\n```md\n# not a real heading\n```\n";
  const formatted = formatMarkdown(raw);
  assert.equal(formatted, raw);
});
