require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const jobRoutes = require("./routes/jobRoutes");
const intelRoutes = require("./routes/intelRoutes");
const travelRoutes = require("./routes/travelRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend from /public
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve saved HTML reports (generated to /tmp by pdfService)
app.get("/report", (req, res) => {
  const reportPath = req.query.path;
  if (!reportPath || !reportPath.startsWith("/tmp/jobs-")) {
    return res.status(400).send("Invalid report path");
  }
  res.sendFile(reportPath);
});

app.use("/api/jobs", jobRoutes);
app.use("/api/intel", intelRoutes);
app.use("/api/travel", travelRoutes);

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});
