import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import {
  pipeline,
  AutoTokenizer,
  AutoModelForSequenceClassification,
} from "@huggingface/transformers";
import { log } from "node:console";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "ANTHROPIC_API_KEY is missing: copy .env.example to .env and fill it in",
  );
  process.exit(1);
}

const client = new Anthropic();
const response = await client.messages.create({
  model: "claude-haiku-5-5",
  max_tokens: 50,
  thinking: { type: "disabled" },
  messages: [{ role: "user", content: "Say hi" }],
});

for (const block of response.content) {
  if (block.type === "text") console.log(block.text);
}
console.log(response.stop_reason);

// Embedding

const beforeLoad = performance.now();

const featureExtractionPipeline = await pipeline(
  "feature-extraction",
  "onnx-community/all-MiniLM-L6-v2-ONNX",
);

const afterLoad = performance.now();

const tensorResult = await featureExtractionPipeline("This is a test string", {
  pooling: "mean",
  normalize: true,
});

const afterEmbed = performance.now();

const vec = tensorResult.tolist() as number[][];
console.log("vector length: ", vec[0]?.length);
const sum = vec[0]?.reduce((sum: number, x: number) => sum + x * x, 0);

console.log({
  sum,
  loadTime: afterLoad - beforeLoad,
  embedTime: afterEmbed - afterLoad,
});

// Rerank
const beforeRerankLoad = performance.now();

const tokenizer = await AutoTokenizer.from_pretrained(
  "Xenova/bge-reranker-base",
);
const reranker = await AutoModelForSequenceClassification.from_pretrained(
  "Xenova/bge-reranker-base",
  { dtype: "q8" },
);

const afterRerankLoad = performance.now();

console.log({ rerankLoad: afterRerankLoad - beforeRerankLoad });

const query = "How do I cancel an in-flight fetch request?";

const chunks = [
  // RELEVANT
  "To cancel an in-flight request, create an AbortController and pass its signal to the operation you want to be able to stop, for example fetch(url, { signal: controller.signal }). When you later call controller.abort(), the signal's aborted flag becomes true, an 'abort' event fires on the signal, and the pending fetch rejects with a DOMException named 'AbortError'. You can catch that error and tell it apart from real network failures by checking err.name === 'AbortError'. One controller can cancel several operations that share its signal, but a controller can only abort once, so create a new one for each new request you want to be able to cancel.",

  // WRONG
  "Network requests can hang for a long time when a server is slow, so it helps to have a clear timeout and retry strategy. A common pattern wraps fetch in a helper that races it against a timer and treats a slow response as a failure. If it fails, the helper waits with exponential backoff (500ms, then 1s, then 2s) and tries again, up to a maximum number of attempts. Some people mention AbortController or a signal option in these helpers, but here the timer only stops waiting for the result. The underlying request keeps running in the background, and abort() is never called, so nothing is actually cancelled. The retry logic just ignores the late response when it finally arrives.",

  // UNRELATED (near-topic): shares the query's words but is about something else
  "A common surprise with fetch is that it doesn't reject when the server returns an error status. A request that gets a 404 or 500 back still resolves normally, because fetch only rejects when the request can't complete at all, for example on a DNS failure, a refused connection or a CORS block. To stop processing a bad response, check response.ok or response.status yourself and throw if the status is outside the 2xx range. Many teams put this check in a small wrapper so every call site cancels its success path the same way, whether it's parsing JSON or updating the UI.",
];

const queries = new Array(3).fill(query);

const inputs = await tokenizer(queries, {
  text_pair: chunks,
  padding: true,
  truncation: true,
});

console.log("input dims: ", inputs.input_ids.dims);

const beforeScore = performance.now();
const { logits } = await reranker(inputs);
const afterScore = performance.now();

const scores = (logits.tolist() as number[][]).map((row) => row[0]);
console.log({ scores, scoreTime: afterScore - beforeScore });
