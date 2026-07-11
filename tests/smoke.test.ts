import { test } from "node:test";
import assert from "node:assert/strict";
import { SUPPORTED_BLOCKS, MARKDOWN_RULES, NOTE_FORMAT_GUIDE, slugify } from "../src/index.js";

test("SUPPORTED_BLOCKS is the expected static list", () => {
  assert.deepEqual(SUPPORTED_BLOCKS, [
    "heading",
    "paragraph",
    "code",
    "table",
    "list",
    "blockquote",
    "image",
    "divider",
  ]);
});

test("MARKDOWN_RULES has 7 rules", () => {
  assert.equal(MARKDOWN_RULES.length, 7);
});

test("NOTE_FORMAT_GUIDE composes its prompts with the example markdown embedded", () => {
  assert.ok(NOTE_FORMAT_GUIDE.ai_prompt.includes(NOTE_FORMAT_GUIDE.example_markdown));
  assert.ok(NOTE_FORMAT_GUIDE.restructure_prompt.includes(NOTE_FORMAT_GUIDE.example_markdown));
});

test("slugify lowercases, strips punctuation, and hyphenates", () => {
  assert.equal(slugify("Docker Images!"), "docker-images");
  assert.equal(slugify("  Multiple   Spaces  "), "multiple-spaces");
  assert.equal(slugify("1.1 Image vs Container"), "11-image-vs-container");
});
