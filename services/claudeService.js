const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callClaude(systemPrompt, userContent, options = {}) {
  const { maxTokens = 4096 } = options;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    return response.content[0].text;
  } catch (err) {
    throw new Error(`Claude API call failed: ${err.message}`);
  }
}

async function callClaudeJSON(systemPrompt, userContent, options = {}) {
  const jsonSystemPrompt =
    systemPrompt +
    "\n\nAlways respond with valid JSON only. No markdown, no explanation, no code fences. Pure JSON.";

  let raw;
  try {
    raw = await callClaude(jsonSystemPrompt, userContent, options);
  } catch (err) {
    throw new Error(`Claude JSON call failed: ${err.message}`);
  }

  try {
    return JSON.parse(raw);
  } catch {
    // Attempt to extract a JSON object from the response
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // Fall through to final error
      }
    }

    throw new Error(
      `Failed to parse Claude response as JSON. Raw response: ${raw}`
    );
  }
}

module.exports = { callClaude, callClaudeJSON };
