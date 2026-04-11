function buildJobPrompt(jobTitle, skills, jobListings) {
  const skillsStr = Array.isArray(skills) ? skills.join(", ") : skills;
  const listings = (jobListings || []).slice(0, 15);

  const systemPrompt =
    "You are an expert career coach and job market analyst. Your job is to analyze job listings " +
    "and a candidate's profile, then return a structured JSON analysis. You must always respond " +
    "with valid JSON only — no markdown, no explanation, no code fences.";

  const userContent = `Candidate target role: ${jobTitle}
Candidate current skills: ${skillsStr}

Raw job listings data:
${JSON.stringify(listings, null, 2)}

Analyze these listings against the candidate's profile and return a JSON object with this exact structure:
{
  "summary": "2-3 sentence overview of the job market for this role",
  "totalFound": number,
  "matches": [
    {
      "rank": 1,
      "title": "job title",
      "company": "company name",
      "location": "location",
      "matchPercentage": 85,
      "matchReason": "why this is a good match",
      "keyGap": "one specific missing skill or requirement",
      "url": "url or empty string",
      "salary": "salary range or Not listed"
    }
  ],
  "skillGaps": ["skill1", "skill2"],
  "matchedSkills": ["skill1", "skill2"],
  "topSkillsInDemand": ["skill1", "skill2"],
  "recommendation": "one actionable sentence for the candidate"
}`;

  return { systemPrompt, userContent };
}

module.exports = { buildJobPrompt };
