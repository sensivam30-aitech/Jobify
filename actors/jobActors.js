const JOB_ACTORS = {
  linkedin: {
    actorId: "curious_coder/linkedin-jobs-scraper",
    buildInput: (title, location) => ({
      urls: [
        "https://www.linkedin.com/jobs/search/?keywords=" +
          encodeURIComponent(title) +
          "&location=" +
          encodeURIComponent(location),
      ],
      count: 10,
      proxy: { useApifyProxy: true },
    }),
  },
  indeed: {
    actorId: "misceres/indeed-scraper",
    buildInput: (title, location) => ({
      position: title,
      country: "US",
      location: location,
      maxItems: 10,
    }),
  },
};

function buildJobSearchInputs(jobTitle, location, skills) {
  return {
    jobTitle,
    location,
    skills,
    linkedinInput: JOB_ACTORS.linkedin.buildInput(jobTitle, location),
    indeedInput: JOB_ACTORS.indeed.buildInput(jobTitle, location),
  };
}

module.exports = { JOB_ACTORS, buildJobSearchInputs };
