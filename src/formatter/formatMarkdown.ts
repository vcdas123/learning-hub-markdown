import { stripBoilerplate } from "../parser/markdownIt.js";

const HEADING_RE = /^#{1,6}\s+\S/;
const FENCE_RE = /^```/;

// Phase 5 of the shared Markdown package migration. New functionality (not
// moved from either app — neither had a formatter before this). Purely a
// text-level cleanup pass; it never touches note content semantics, only
// whitespace/blank-line conventions, so it's always safe to preview before
// applying (see the frontend's "Auto Fix" button, which shows a diff-free
// direct replace since the transform is whitespace-only).
export function formatMarkdown(raw: string): string {
  const stripped = stripBoilerplate(raw);
  const normalized = stripped.replace(/\r\n/g, "\n");
  const rawLines = normalized.split("\n").map((line) => line.replace(/[ \t]+$/, ""));

  const out: string[] = [];
  let inFence = false;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const isFenceDelimiter = FENCE_RE.test(line);
    // Never touch content inside a fenced code block — lines that merely
    // *look* like a heading or a fence delimiter there are literal content.
    const isHeading = !inFence && HEADING_RE.test(line);
    const isFenceOpen = !inFence && isFenceDelimiter;
    const isFenceClose = inFence && isFenceDelimiter;

    if ((isHeading || isFenceOpen) && out.length > 0 && out[out.length - 1] !== "") {
      out.push("");
    }

    out.push(line);
    if (isFenceDelimiter) inFence = !inFence;

    const nextLine = rawLines[i + 1];
    if ((isHeading || isFenceClose) && nextLine !== undefined && nextLine !== "") {
      out.push("");
    }
  }

  // Collapse 3+ consecutive blank lines down to exactly 1.
  const collapsed: string[] = [];
  for (const line of out) {
    if (line === "" && collapsed[collapsed.length - 1] === "") continue;
    collapsed.push(line);
  }

  // Trim leading/trailing blank lines, then ensure exactly one trailing newline.
  while (collapsed.length && collapsed[0] === "") collapsed.shift();
  while (collapsed.length && collapsed[collapsed.length - 1] === "") collapsed.pop();

  return collapsed.join("\n") + "\n";
}
