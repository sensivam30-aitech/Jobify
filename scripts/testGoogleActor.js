require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { ApifyClient } = require('apify-client');

const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

async function main() {
  const actorId = 'apify/google-search-scraper';
  const input = {
    queries: 'Notion pricing',
    maxPagesPerQuery: 1,
    resultsPerPage: 10,
  };

  console.log('Starting actor run...');
  const run = await client.actor(actorId).call(input);
  console.log('Run object:', JSON.stringify(run, null, 2));

  console.log('Waiting for finish...');
  const finishedRun = await client.run(run.id).waitForFinish({ waitSecs: 60 });
  console.log('Finished run status:', finishedRun.status);

  const { items } = await client.dataset(finishedRun.defaultDatasetId).listItems({ limit: 3 });
  console.log('First 3 dataset items:', JSON.stringify(items, null, 2));
}

main().catch((err) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});
