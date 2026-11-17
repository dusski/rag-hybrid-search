# rag-hybrid-search

RAG system with hybrid search (vector + BM25), reranking and validated citations. Work in progress.

## Setup

```sh
npm install
cp .env.example .env   # then add ANTHROPIC_API_KEY
npm run smoke          # Claude call works
```

TypeScript on Node. The earlier Python attempt lives on the `python-version` branch.
