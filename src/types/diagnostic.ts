// No dedicated diagnostic type exists in either app yet today — the backend
// validator (markdownValidator.ts) returns flat { ok, errors, warnings }
// string arrays with no per-item structure. This is a newly authored type,
// not copied from existing code, intended as the target shape for a future
// phase's validator (see the Phase 1 plan — validation logic itself is
// intentionally not migrated yet).
export type MarkdownValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};
