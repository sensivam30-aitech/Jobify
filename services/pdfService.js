// PDF export is handled client-side via window.print() in the browser —
// this service only generates and stores the HTML.

const fs = require("fs");
const path = require("path");

const STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; font-size: 14px; background: #fff; color: #333; padding: 40px; }
  .header { margin-bottom: 32px; }
  .header h1 { color: #1a1a2e; font-size: 24px; margin-bottom: 4px; }
  .header .timestamp { color: #888; font-size: 12px; }
  h2 { color: #1a1a2e; font-size: 18px; margin: 24px 0 12px; }
  h3 { color: #5a4fcf; font-size: 15px; margin: 16px 0 8px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #5a4fcf; color: #fff; text-align: left; padding: 10px 12px; font-weight: 600; }
  td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; }
  tr:hover td { background: #f9f9fb; }
  a { color: #5a4fcf; text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul { margin: 0 0 12px 20px; }
  li { margin-bottom: 4px; }
  .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .swot-cell { border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; }
  .swot-cell h3 { margin-top: 0; }
  .day-section { border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; margin-bottom: 16px; }
`;

function htmlShell(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${STYLES}</style>
</head>
<body>
  <div class="header">
    <h1>ReWire Report</h1>
    <div class="timestamp">Generated: ${new Date().toISOString()}</div>
  </div>
  ${bodyContent}
</body>
</html>`;
}

function jobsTemplate(data) {
  const rows = (data?.matches ?? [])
    .map(
      (j) => `
    <tr>
      <td>${j?.title ?? "—"}</td>
      <td>${j?.company ?? "—"}</td>
      <td>${j?.matchPercentage ?? "—"}%</td>
      <td>${j?.keyGap ?? "—"}</td>
      <td>${j?.url ? `<a href="${j.url}" target="_blank">Apply</a>` : "—"}</td>
    </tr>`
    )
    .join("");

  return htmlShell(
    "Jobs Report",
    `<h2>Job Matches</h2>
    <table>
      <thead><tr><th>Role</th><th>Company</th><th>Match %</th><th>Key Gap</th><th>Apply Link</th></tr></thead>
      <tbody>${rows || "<tr><td colspan=\"5\">No jobs data</td></tr>"}</tbody>
    </table>`
  );
}

function intelTemplate(data) {
  const swotSection = (items) =>
    `<ul>${(items ?? []).map((s) => `<li>${s}</li>`).join("")}</ul>`;

  const featureRows = (data?.featureMatrix ?? [])
    .map(
      (f) => `
    <tr>
      <td>${f?.feature ?? "—"}</td>
      ${(f?.competitors ?? []).map((c) => `<td>${c ?? "—"}</td>`).join("")}
    </tr>`
    )
    .join("");

  const featureHeaders = (data?.featureMatrix?.[0]?.competitors ?? [])
    .map((_, i) => `<th>Competitor ${i + 1}</th>`)
    .join("");

  const pricingRows = (data?.pricing ?? [])
    .map(
      (p) => `
    <tr>
      <td>${p?.provider ?? "—"}</td>
      <td>${p?.plan ?? "—"}</td>
      <td>${p?.price ?? "—"}</td>
      <td>${p?.notes ?? "—"}</td>
    </tr>`
    )
    .join("");

  return htmlShell(
    "Intel Report",
    `<h2>SWOT Analysis</h2>
    <div class="swot-grid">
      <div class="swot-cell"><h3>Strengths</h3>${swotSection(data?.swot?.strengths)}</div>
      <div class="swot-cell"><h3>Weaknesses</h3>${swotSection(data?.swot?.weaknesses)}</div>
      <div class="swot-cell"><h3>Opportunities</h3>${swotSection(data?.swot?.opportunities)}</div>
      <div class="swot-cell"><h3>Threats</h3>${swotSection(data?.swot?.threats)}</div>
    </div>

    <h2>Feature Matrix</h2>
    <table>
      <thead><tr><th>Feature</th>${featureHeaders}</tr></thead>
      <tbody>${featureRows || "<tr><td colspan=\"2\">No feature data</td></tr>"}</tbody>
    </table>

    <h2>Pricing</h2>
    <table>
      <thead><tr><th>Provider</th><th>Plan</th><th>Price</th><th>Notes</th></tr></thead>
      <tbody>${pricingRows || "<tr><td colspan=\"4\">No pricing data</td></tr>"}</tbody>
    </table>`
  );
}

function travelTemplate(data) {
  const days = (data?.days ?? [])
    .map(
      (day, i) => `
    <div class="day-section">
      <h2>Day ${i + 1}${day?.title ? ` — ${day.title}` : ""}</h2>
      <h3>Activities</h3>
      <ul>${(day?.activities ?? []).map((a) => `<li>${a}</li>`).join("")}</ul>
      <h3>Food Picks</h3>
      <ul>${(day?.foodPicks ?? []).map((f) => `<li>${f}</li>`).join("")}</ul>
      <h3>Creator Links</h3>
      <ul>${(day?.creatorLinks ?? []).map((l) => `<li><a href="${l?.url ?? "#"}" target="_blank">${l?.label ?? l?.url ?? "Link"}</a></li>`).join("")}</ul>
    </div>`
    )
    .join("");

  return htmlShell(
    "Travel Report",
    days || "<p>No travel data available.</p>"
  );
}

function generateHTMLReport(data, templateType) {
  switch (templateType) {
    case "jobs":
      return jobsTemplate(data);
    case "intel":
      return intelTemplate(data);
    case "travel":
      return travelTemplate(data);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}

function saveReport(htmlString, filename) {
  const dir = "/tmp";
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${filename}.html`);
  fs.writeFileSync(filePath, htmlString, "utf-8");
  return filePath;
}

module.exports = { generateHTMLReport, saveReport };
