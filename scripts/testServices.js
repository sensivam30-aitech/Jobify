require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { testApifyConnection } = require("../services/apifyService");
const { callClaude } = require("../services/claudeService");

async function main() {
  console.log("Testing Apify connection...");
  try {
    const ok = await testApifyConnection();
    if (ok) {
      console.log("✓ Apify connection OK");
    }
  } catch (err) {
    console.log("✗ Apify failed: " + err.message);
  }

  console.log("Testing Claude connection...");
  try {
    const response = await callClaude(
      "You are a test assistant.",
      "Reply with the single word: working"
    );
    console.log("✓ Claude response: " + response);
  } catch (err) {
    console.log("✗ Claude failed: " + err.message);
  }
}

main().catch(console.error);
