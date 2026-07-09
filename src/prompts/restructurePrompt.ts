import { EXAMPLE_MARKDOWN } from "../constants/exampleMarkdown.js";

// Copied verbatim from learning-hub-backend/src/constants/noteFormat.ts
// (guide.restructure_prompt) — the "Restructure Prompt" template used by
// FormatGuide.
export const RESTRUCTURE_PROMPT =
  "You are a technical documentation formatter. I will give you an EXISTING note. Rewrite it so it EXACTLY matches the format below, WITHOUT changing, adding, or removing any of the actual information — only restructure it.\n\nFORMAT RULES:\n1. The first line must be the title as a level-1 heading: `# Title`.\n2. Keep any short intro text right after the title (before the first `##`).\n3. Convert the major parts into `## ` sections (these become the navigation).\n4. Use `### ` for subsections within a section.\n5. Every fenced code block MUST declare its language, e.g. ```sql or ```python. If a code block has no language, infer the correct one.\n6. Convert any tabular data into GitHub-style pipe tables with a `| --- |` separator row.\n7. Preserve **bold**, *italic*, `inline code`, [links](url), and lists.\n8. Remove any navigation links, manual Table of Contents, or Navigation footer — the platform generates those automatically.\n9. Do not summarize or omit content. Keep all details intact.\n\nReference example of the target format:\n\n----------------------------------------\n" +
  EXAMPLE_MARKDOWN +
  "----------------------------------------\n\nOutput ONLY the reformatted Markdown, with no explanations before or after.\n\nHere is my existing note to reformat:\n\n<paste your note here or provide the path to your notes>";
