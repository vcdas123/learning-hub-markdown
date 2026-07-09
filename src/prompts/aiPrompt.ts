import { EXAMPLE_MARKDOWN } from "../constants/exampleMarkdown.js";

// Copied verbatim from learning-hub-backend/src/constants/noteFormat.ts
// (guide.ai_prompt) — the "Generate Prompt" template used by FormatGuide.
export const AI_PROMPT =
  "You are a technical documentation author. Generate a single Markdown (.md) note that EXACTLY follows the format below so an automated parser can read it.\n\nFORMAT RULES:\n1. The first line is the title as a level-1 heading: `# Title`.\n2. You may add a short intro paragraph after the title (before any `##`).\n3. Use `## ` for each major section (these become the navigation menu).\n4. Use `### ` for subsections inside a section.\n5. Every fenced code block MUST declare its language, e.g. ```sql or ```python.\n6. Use GitHub-style pipe tables with a `| --- |` separator row.\n7. Use **bold**, *italic*, `inline code`, [links](url), and `-`/`1.` lists.\n8. Do NOT add navigation links, a manual Table of Contents, or a Navigation footer — the platform creates those automatically.\n\nHere is a reference example of the exact format:\n\n----------------------------------------\n" +
  EXAMPLE_MARKDOWN +
  "----------------------------------------\n\nNow write the note about the following topic. If a transcript or source file is provided, base the note on its content. Output ONLY the Markdown, with no explanations before or after:\n\nTOPIC: <describe your topic, or paste/provide the path to a transcript or source file>";
