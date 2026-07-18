export interface MarkdownDiagnosticItem {
  message: string;
  severity: "error" | "warning";
  /** 1-indexed line number in the raw text passed in. */
  line: number;
}

// Line-aware companion to validateMarkdownSource/validateMarkdown — those
// return flat aggregate `errors`/`warnings: string[]` (the long-standing
// shape every consumer, including the backend's API responses, already
// depends on), with no position info. This is a separate, additive export
// specifically for an editor to anchor inline diagnostics at the *correct*
// line instead of guessing/defaulting to line 1 (which reads as a "fake"
// warning on an unrelated line, e.g. the title, when the real issue is a
// code fence further down).
//
// Runs directly against the raw text (not the boilerplate-stripped
// `cleaned` text validateMarkdownSource uses) so line numbers always match
// what's actually on screen in an editor showing the raw content. This
// means results can differ very slightly from validateMarkdownSource for
// notes that still contain legacy manual Table of Contents/Navigation
// boilerplate (stripped before the backend's own checks run) — an
// acceptable tradeoff since that's a rare, migration-only case, and this
// function exists purely for on-screen positioning.
export function getMarkdownDiagnostics(raw: string): MarkdownDiagnosticItem[] {
  const diagnostics: MarkdownDiagnosticItem[] = [];

  if (!raw.trim()) {
    diagnostics.push({ message: "The note is empty.", severity: "error", line: 1 });
    return diagnostics;
  }

  const lines = raw.split(/\r?\n/);
  const firstNonEmptyIdx = lines.findIndex((line) => line.trim());
  const firstNonEmpty = firstNonEmptyIdx >= 0 ? lines[firstNonEmptyIdx] : "";
  const h1LineIndexes: number[] = [];

  if (!/^#\s+\S/.test(firstNonEmpty)) {
    diagnostics.push({
      message: "Must start with a level-1 title heading, e.g. '# My Title'.",
      severity: "error",
      line: (firstNonEmptyIdx >= 0 ? firstNonEmptyIdx : 0) + 1,
    });
  }

  const sectionLineIdx = lines.findIndex((line) => /^##\s+\S/.test(line));
  if (sectionLineIdx === -1) {
    diagnostics.push({
      message: "Must contain at least one section heading, e.g. '## Section Title'.",
      severity: "error",
      // No single line "owns" this omission — anchor to the title line
      // (or line 1) rather than an arbitrary unrelated line.
      line: (firstNonEmptyIdx >= 0 ? firstNonEmptyIdx : 0) + 1,
    });
  }

  let inFence = false;
  lines.forEach((line, idx) => {
    const value = line.trim();
    if (value.startsWith("```")) {
      if (!inFence) {
        if (!value.slice(3).trim()) {
          diagnostics.push({
            message: "A code block has no language. Add a language after the opening fence, e.g. ```sql, ```python, or ```text.",
            severity: "error",
            line: idx + 1,
          });
        }
        inFence = true;
      } else {
        inFence = false;
      }
      return;
    }

    if (!inFence && /^#\s+\S/.test(line)) {
      h1LineIndexes.push(idx);
    }
  });

  if (h1LineIndexes.length > 1) {
    for (const idx of h1LineIndexes.slice(1)) {
      diagnostics.push({
        message: "Only one level-1 title heading is allowed. Use ##, ###, or #### for sections inside the note.",
        severity: "error",
        line: idx + 1,
      });
    }
  }

  lines.forEach((line, idx) => {
    if (/^##\s+Table of Contents/.test(line)) {
      diagnostics.push({
        message: "A manual 'Table of Contents' was found — the platform generates navigation automatically, so this is usually unnecessary.",
        severity: "warning",
        line: idx + 1,
      });
    }
    if (/^##\s+Navigation/.test(line)) {
      diagnostics.push({
        message: "A manual 'Navigation' section was found — the platform generates navigation automatically, so this is usually unnecessary.",
        severity: "warning",
        line: idx + 1,
      });
    }
  });

  return diagnostics;
}
