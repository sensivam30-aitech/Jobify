const INTEL_ACTORS = {
  google: {
    actorId: "apify/google-search-scraper",
    buildInput: (companyName) => ({
      queries: companyName + " pricing features review competitors",
      maxPagesPerQuery: 1,
      resultsPerPage: 10,
      languageCode: "en",
      countryCode: "us",
    }),
  },
  g2: {
    actorId: "curious_coder/g2-scraper",
    buildInput: (companyName) => ({
      companyName: companyName,
      maxReviews: 10,
    }),
  },
  linkedin: {
    actorId: "bebity/linkedin-company-scraper",
    buildInput: (companyName) => ({
      searchQuery: companyName,
      maxResults: 5,
    }),
  },
};

function buildIntelInputs(companyName, competitorNames) {
  return {
    companyName,
    competitorNames,
    googleInput: INTEL_ACTORS.google.buildInput(companyName),
    g2Input: INTEL_ACTORS.g2.buildInput(companyName),
    linkedinInput: INTEL_ACTORS.linkedin.buildInput(companyName),
  };
}

module.exports = { INTEL_ACTORS, buildIntelInputs };
