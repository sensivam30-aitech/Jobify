const { ApifyClient } = require("apify-client");

const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

async function runActor(actorId, input, options = {}) {
  const { maxItems = 20 } = options;

  try {
    const run = await client.actor(actorId).call(input);
    const finishedRun = await client.run(run.id).waitForFinish({ waitSecs: 60 });

    if (finishedRun.status !== "SUCCEEDED") {
      throw new Error(
        `Actor ${actorId} failed with status: ${finishedRun.status}`
      );
    }

    const { items } = await client
      .dataset(finishedRun.defaultDatasetId)
      .listItems({ limit: maxItems });

    return items;
  } catch (err) {
    throw new Error(`Apify runActor failed for ${actorId}: ${err.message}`);
  }
}

async function testApifyConnection() {
  try {
    await runActor("apify/hello-world", {});
    return true;
  } catch {
    return false;
  }
}

module.exports = { runActor, testApifyConnection };
