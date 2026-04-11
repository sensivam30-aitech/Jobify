function buildIntelPrompt(companyName, competitorNames, rawData) {
  const competitorsStr = Array.isArray(competitorNames)
    ? competitorNames.join(", ")
    : competitorNames;
  const data = (Array.isArray(rawData) ? rawData : []).slice(0, 20);

  const systemPrompt =
    "You are an expert business analyst and competitive intelligence consultant. " +
    "Your job is to analyze scraped web data about a company and its competitors, " +
    "then return a structured JSON report. You must always respond with valid JSON " +
    "only — no markdown, no explanation, no code fences.";

  const userContent = `Target company: ${companyName}
Known competitors: ${competitorsStr}

Raw scraped data:
${JSON.stringify(data, null, 2)}

Analyze this data and return a JSON object with this exact structure:
{
  "companyName": "name",
  "summary": "2-3 sentence executive summary of the competitive landscape",
  "swot": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "opportunities": ["opportunity1", "opportunity2"],
    "threats": ["threat1", "threat2"]
  },
  "featureMatrix": [
    {
      "feature": "feature name",
      "targetCompany": "Yes / No / Partial",
      "competitors": "Yes / No / Partial"
    }
  ],
  "pricingIntel": [
    {
      "company": "company name",
      "pricingModel": "freemium / subscription / usage-based / enterprise",
      "estimatedRange": "price range or Unknown",
      "notes": "any pricing notes"
    }
  ],
  "hiringSignals": ["what their job postings reveal they are building next"],
  "recommendation": "one strategic recommendation for competing against this company"
}`;

  return { systemPrompt, userContent };
}

module.exports = { buildIntelPrompt };
