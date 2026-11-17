import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is missing: copy .env.example to .env and fill it in");
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
