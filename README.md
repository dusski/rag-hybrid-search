# rag-hybrid-search

RAG system with hybrid search (vector + BM25), reranking and validated citations. Work in progress.

## Setup

```sh
npm install
cp .env.example .env   # then add ANTHROPIC_API_KEY
npm run smoke          # Claude call works
```

TypeScript on Node. The earlier Python attempt lives on the `python-version` branch.

## Corpus

[Angular](https://angular.dev) documentation: the forms guides (`guide/forms`, 22 files) and
the error reference (`reference/errors`, 69 files), 91 Markdown files in total, copied from
`adev/src/content/` in [angular/angular](https://github.com/angular/angular) at commit
[`8d09032`](https://github.com/angular/angular/tree/8b15295e8c7f1543d41dadb5955279702be52c16/adev/src/content) (2026-11-20).

Why this corpus: <your one or two sentences: you know Angular well enough to judge answers;
error pages test exact-term search (codes like NG0100), the forms guides test conceptual questions.>

### Attribution
The documents in `data/raw/` are © 2010-2026 Google LLC, used under the MIT License;
the full notice is in [`data/raw/LICENSE`](data/raw/LICENSE).