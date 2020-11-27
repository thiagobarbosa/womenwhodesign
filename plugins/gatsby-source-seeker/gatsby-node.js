const fetch = require("node-fetch");
const crypto = require("crypto");
const marked = require("marked");

exports.sourceNodes = async ({ actions }, configOptions) => {
  if (!configOptions.key) {
    throw new Error(
      "You must provide an API key to `gatsby-source-seeker`. \n If you don't have a Seeker API key, follow these steps: \n 1. Delete the gatsby-source-seeker plugin (lines 12-17) from the gatsby-config.js file \n 2. Delete the entire gatsby-node.js file \n 3. Delete the src/pages/jobs.js file \n 4. Remove the link to the jobs page from the src/components/nav file"
    );
  }

  const { createNode } = actions;
  const apiOptions = configOptions.key;
  const jobs = [];

  const res = await fetch(`https://api.seeker.company/v1/jobs?page_size=100`, {
    headers: {
      Authorization: `Token ${apiOptions}`,
    },
  });

  // eslint-disable-next-line no-await-in-loop
  const data = await res.json();

  if (data.results.length < 1) {
    const emptyJob = {
      job_description: "Empty",
      job_application_link: "Empty",
      job_title: "Empty",
      id: "Empty000000",
      creation_date: "Empty",
      end_date: "Empty",
      job_link: "Empty",
      job_location: "Empty",
      company: {
        name: "Empty",
        company_url: "Empty",
      },
    };
    jobs.push(emptyJob);
  } else {
    data.results.forEach((d) => {
      jobs.push({
        ...d,
        job_description: marked(d.job_description),
      });
    });
  }

  jobs.forEach((job) => {
    const jsonString = JSON.stringify(job);

    const gatsbyNode = {
      job: { ...job },
      id: `Seeker: ${job.id}`,
      parent: "__SOURCE__",
      children: [],
      internal: {
        type: "Seeker",
        contentDigest: crypto
          .createHash("md5")
          .update(jsonString)
          .digest("hex"),
      },
    };

    createNode(gatsbyNode);
  });
};
