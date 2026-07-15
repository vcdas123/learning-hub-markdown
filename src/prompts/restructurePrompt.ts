import { EXAMPLE_MARKDOWN } from "../constants/exampleMarkdown.js";

// Copied verbatim from learning-hub-backend/src/constants/noteFormat.ts
// (guide.restructure_prompt) — the "Restructure Prompt" template used by
// FormatGuide.
export const RESTRUCTURE_PROMPT =
  "You are a technical documentation formatter. I will give you an EXISTING note. Rewrite it so it EXACTLY matches the format below, WITHOUT changing, adding, or removing any of the actual information — only restructure it.\n\nFORMAT RULES:\n1. The first line must be the title as the ONLY level-1 heading: `# Title`.\n2. Convert any additional `# ` headings into `##`, `###`, or `####` headings so the note has exactly one H1.\n3. Keep any short intro text right after the title (before the first `##`).\n4. Convert the major parts into `## ` sections (these become the navigation).\n5. Use `### ` or deeper headings for subsections within a section.\n6. Every fenced code block MUST declare its language, e.g. ```sql or ```python. If a code block has no language, infer the correct one.\n7. Convert any tabular data into GitHub-style pipe tables with a `| --- |` separator row.\n8. Preserve **bold**, *italic*, `inline code`, [links](url), and lists.\n9. Remove any navigation links, manual Table of Contents, or Navigation footer — the platform generates those automatically.\n10. Do not summarize or omit content. Keep all details intact.\n\nReference example of the target format:\n\n----------------------------------------\n" +
  EXAMPLE_MARKDOWN +
  "----------------------------------------\n\nOutput ONLY the reformatted Markdown, with no explanations before or after.\n\nHere is my existing note to reformat:\n\n<paste your note here or provide the path to your notes>";
