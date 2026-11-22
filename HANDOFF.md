# Handoff: next session

Last updated 2026-11-22. Start here, then read the files listed below.

## Where things stand
- Tasks 1–2 of 16 done (setup + local embedding/rerank spike; Angular docs corpus).
- Code: `scripts/smoke-test.ts` (Claude call, embedding, rerank), flat and throwaway.
- Data: `data/raw/` (91 Angular docs: forms guides + error reference), `data/seed-questions.json` (8 questions).

## Next: task 3, load and chunk the documents
Plan and "Done when" check: `../../tasks/project-1-rag.md`, task 3.

Before writing code:
1. Look at 3–4 files in `data/raw/` and decide what to strip or keep (angular.dev tags like `<docs-video>`, `<docs-code>`, `NOTE:`/`TIP:` callouts, code blocks, tables).
2. Plan the restructure: move from the flat smoke test to real modules, starting with the chunker.
3. Set `env.cacheDir` for transformers.js to a gitignored project folder.

## Read first
- `../../AGENTS.md`: how the coaching works (I write the code; Claude guides and reviews).
- `../../progress.md`, Project 1: status, log, and **Open items** (tasks 3, 4, 11).
- `../../tasks/project-1-rag.md`: the task plan and the Results so far.
