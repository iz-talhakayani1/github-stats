const { fetchGitHubData } = require('../helpers/githubHelper');
const Repo = require('../models/repoModel');
const Commit = require('../models/commitModel');
const PullRequest = require('../models/pullRequestModel');
const Issue = require('../models/issueModel');

const getRepos = async (req, res) => {
  const { githubOrg } = req.params;

  const url = `https://api.github.com/orgs/${githubOrg}/repos`;

  try {
    const repos = await fetchGitHubData(url);
    await Repo.insertMany(repos); // Store in MongoDB
    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UnComment for update duplicated data and insert new data
/*

const getRepos = async (req, res) => {
  const { githubOrg } = req.params;
  const url = `https://api.github.com/orgs/${githubOrg}/repos`;

  try {
    const repos = await fetchGitHubData(url);

    // Use bulkWrite to upsert (insert or update)
    const bulkOps = repos.map((repo) => ({
      updateOne: {
        filter: { id: repo.id }, // Check by unique field (GitHub ID)
        update: { $set: repo }, // Update existing or insert if not found
        upsert: true,
      },
    }));

    await Repo.bulkWrite(bulkOps);

    res.json({ message: 'Repositories upserted successfully', repos });
  } catch (err) {
    console.error('Error fetching repositories:', err.message);
    res.status(500).json({ error: err.message });
  }
};
*/

const getRepoDetails = async (req, res) => {
  const { repoName, githubOrg } = req.params;

  try {
    // Fetch data from GitHub API
    const repoUrl = `https://api.github.com/repos/${githubOrg}/${repoName}`;
    const commitsUrl = `${repoUrl}/commits`;
    const pullRequestsUrl = `${repoUrl}/pulls?state=all`;
    const issuesUrl = `${repoUrl}/issues?state=all`;

    const [repoData, commits, pullRequests, issues] = await Promise.all([
      fetchGitHubData(repoUrl),
      fetchGitHubData(commitsUrl),
      fetchGitHubData(pullRequestsUrl),
      fetchGitHubData(issuesUrl),
    ]);

    await Commit.insertMany(commits);
    await PullRequest.insertMany(pullRequests);
    await Issue.insertMany(issues);
    // Format or store data if necessary
    res.json({
      repo: repoData,
      commits: commits,
      pullRequests: pullRequests,
      issues: issues,
    });
  } catch (error) {
    console.error('Error fetching repo details:', error.message);
    res.status(500).json({ error: 'Failed to fetch repository details' });
  }
};

// UnComment for update duplicated data and insert new data
/* const getRepoDetails = async (req, res) => {
  const { repoName, githubOrg } = req.params;
  const repoUrl = `https://api.github.com/repos/${githubOrg}/${repoName}`;
  const commitsUrl = `${repoUrl}/commits`;
  const pullRequestsUrl = `${repoUrl}/pulls?state=all`;
  const issuesUrl = `${repoUrl}/issues?state=all`;

  try {
    const [repoData, commits, pullRequests, issues] = await Promise.all([
      fetchGitHubData(repoUrl),
      fetchGitHubData(commitsUrl),
      fetchGitHubData(pullRequestsUrl),
      fetchGitHubData(issuesUrl),
    ]);

    // Upsert commits
    const commitOps = commits.map((commit) => ({
      updateOne: {
        filter: { sha: commit.sha }, // Check by unique field (SHA)
        update: { $set: commit },
        upsert: true,
      },
    }));
    await Commit.bulkWrite(commitOps);

    // Upsert pull requests
    const prOps = pullRequests.map((pr) => ({
      updateOne: {
        filter: { id: pr.id }, // Check by unique field (GitHub ID)
        update: { $set: pr },
        upsert: true,
      },
    }));
    await PullRequest.bulkWrite(prOps);

    // Upsert issues
    const issueOps = issues.map((issue) => ({
      updateOne: {
        filter: { id: issue.id }, // Check by unique field (GitHub ID)
        update: { $set: issue },
        upsert: true,
      },
    }));
    await Issue.bulkWrite(issueOps);

    res.json({
      repo: repoData,
      commits,
      pullRequests,
      issues,
    });
  } catch (error) {
    console.error('Error fetching repo details:', error.message);
    res.status(500).json({ error: 'Failed to fetch repository details' });
  }
};
*/

module.exports = {
  getRepos,
  getRepoDetails,
};
