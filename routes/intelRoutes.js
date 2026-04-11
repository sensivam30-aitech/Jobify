const express = require("express");
const router = express.Router();
const { runActor } = require("../services/apifyService");
const { callClaudeJSON } = require("../services/claudeService");
const { generateHTMLReport, saveReport } = require("../services/pdfService");
const { INTEL_ACTORS, buildIntelInputs } = require("../actors/intelActors");
const { buildIntelPrompt } = require("../prompts/intelPrompt");

router.post("/analyze", async (req, res) => {
  try {
    const { companyName, competitorNames } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: "companyName is required" });
    }

    const competitorNamesArray = competitorNames
      ? competitorNames.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    console.log("Intel analysis started for: " + companyName);

    const inputs = buildIntelInputs(companyName, competitorNamesArray);

    const actorLabels = ["Google", "G2", "LinkedIn"];
    const results = await Promise.allSettled([
      runActor(INTEL_ACTORS.google.actorId, inputs.googleInput, { maxItems: 15 }),
      runActor(INTEL_ACTORS.g2.actorId, inputs.g2Input, { maxItems: 10 }),
      runActor(INTEL_ACTORS.linkedin.actorId, inputs.linkedinInput, { maxItems: 5 }),
    ]);

    const rawData = [];
    results.forEach((result, i) => {
      const label = actorLabels[i];
      if (result.status === "fulfilled") {
        console.log(`${label} actor returned ${result.value.length} items`);
        rawData.push(...result.value);
      } else {
        console.warn(`${label} actor failed: ${result.reason?.message}`);
      }
    });

    if (rawData.length === 0) {
      return res.status(404).json({ error: "No data found for this company" });
    }

    const { systemPrompt, userContent } = buildIntelPrompt(
      companyName,
      competitorNamesArray,
      rawData
    );
    const claudeResult = await callClaudeJSON(systemPrompt, userContent);

    const htmlReport = generateHTMLReport(claudeResult, "intel");
    const reportPath = saveReport(htmlReport, "intel-" + Date.now());

    res.status(200).json({
      success: true,
      companyName,
      competitorNames: competitorNamesArray,
      report: claudeResult,
      reportPath,
      rawDataCount: rawData.length,
    });
  } catch (err) {
    console.error("Intel analyze error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
