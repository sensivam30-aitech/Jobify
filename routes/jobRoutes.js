const express = require("express");
const router = express.Router();
const { runActor } = require("../services/apifyService");
const { callClaudeJSON } = require("../services/claudeService");
const { generateHTMLReport, saveReport } = require("../services/pdfService");
const { JOB_ACTORS, buildJobSearchInputs } = require("../actors/jobActors");
const { buildJobPrompt } = require("../prompts/jobPrompt");

router.post("/analyze", async (req, res) => {
  try {
    const { jobTitle, location, skills } = req.body;

    if (!jobTitle || !location) {
      return res.status(400).json({ error: "jobTitle and location are required" });
    }

    const skillsArray = (skills || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    console.log("Job search started for: " + jobTitle + " in " + location);

    const inputs = buildJobSearchInputs(jobTitle, location, skillsArray);

    const results = await Promise.allSettled([
      runActor(JOB_ACTORS.linkedin.actorId, inputs.linkedinInput, { maxItems: 10 }),
      runActor(JOB_ACTORS.indeed.actorId, inputs.indeedInput, { maxItems: 10 }),
    ]);

    const linkedinResults =
      results[0].status === "fulfilled" ? results[0].value : [];
    const indeedResults =
      results[1].status === "fulfilled" ? results[1].value : [];

    if (results[0].status === "rejected") {
      console.log("LinkedIn actor failed:", results[0].reason?.message);
    }
    if (results[1].status === "rejected") {
      console.log("Indeed actor failed:", results[1].reason?.message);
    }

    const combinedListings = [...linkedinResults, ...indeedResults];

    if (combinedListings.length === 0) {
      return res.status(404).json({ error: "No job listings found for these criteria" });
    }

    const { systemPrompt, userContent } = buildJobPrompt(jobTitle, skillsArray, combinedListings);
    const claudeResult = await callClaudeJSON(systemPrompt, userContent);

    const htmlReport = generateHTMLReport(claudeResult, "jobs");
    const reportPath = saveReport(htmlReport, "jobs-" + Date.now());

    res.status(200).json({
      success: true,
      jobTitle,
      location,
      skills: skillsArray,
      report: claudeResult,
      reportPath,
      rawListingsCount: combinedListings.length,
    });
  } catch (err) {
    console.error("Job analyze error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
