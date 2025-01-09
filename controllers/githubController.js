const { fetchGitHubData } = require('../helpers/githubHelper');
const {
  RepositoryModel,
  IssueModel,
  PullRequestModel,
  CommitModel,
} = require('../models/index');

// Fetch and store repository details
const fetchRepoDetails = async (req, res) => {
  const { accountName, repoName } = req.params;

  try {
    // Fetch repository data
    const repoUrl = `https://api.github.com/repos/${accountName}/${repoName}`;
    const commitsUrl = `${repoUrl}/commits`;
    const pullRequestsUrl = `${repoUrl}/pulls?state=all`;
    const issuesUrl = `${repoUrl}/issues?state=all`;

    const [repoData, commits, pullRequests, issues] = await Promise.all([
      fetchGitHubData(repoUrl),
      fetchGitHubData(commitsUrl),
      fetchGitHubData(pullRequestsUrl),
      fetchGitHubData(issuesUrl),
    ]);

    // Store repository
    await RepositoryModel.updateOne(
      { id: repoData.id },
      { $set: repoData },
      { upsert: true }
    );

    // Store commits
    const commitOps = commits.map((commit) => ({
      updateOne: {
        filter: { sha: commit.sha },
        update: { $set: { ...commit, repositoryId: repoData.id } },
        upsert: true,
      },
    }));
    await CommitModel.bulkWrite(commitOps);

    // Store pull requests
    const prOps = pullRequests.map((pr) => ({
      updateOne: {
        filter: { id: pr.id },
        update: { $set: { ...pr, repositoryId: repoData.id } },
        upsert: true,
      },
    }));
    await PullRequestModel.bulkWrite(prOps);

    // Store issues
    const issueOps = issues.map((issue) => ({
      updateOne: {
        filter: { id: issue.id },
        update: { $set: { ...issue, repositoryId: repoData.id } },
        upsert: true,
      },
    }));
    await IssueModel.bulkWrite(issueOps);

    res.status(200).json({
      message: 'Repository details fetched and stored successfully.',
    });
  } catch (error) {
    console.error('Error fetching repository details:', error.message);
    res.status(500).json({ error: 'Failed to fetch repository details.' });
  }
};

// Fetch and store all repositories and their details for an organization
const fetchOrgRepos = async (req, res) => {
  const { accountName } = req.params;

  try {
    // Fetch all repositories for the organization
    const orgReposUrl = `https://api.github.com/orgs/${accountName}/repos`;
    const repos = await fetchGitHubData(orgReposUrl);

    for (const repo of repos) {
      const repoUrl = `https://api.github.com/repos/${accountName}/${repo.name}`;
      const commitsUrl = `${repoUrl}/commits`;
      const pullRequestsUrl = `${repoUrl}/pulls?state=all`;
      const issuesUrl = `${repoUrl}/issues?state=all`;

      const [commits, pullRequests, issues] = await Promise.all([
        fetchGitHubData(commitsUrl),
        fetchGitHubData(pullRequestsUrl),
        fetchGitHubData(issuesUrl),
      ]);

      // Store repository
      await RepositoryModel.updateOne(
        { id: repo.id },
        { $set: repo },
        { upsert: true }
      );

      // Store commits
      const commitOps = commits.map((commit) => ({
        updateOne: {
          filter: { sha: commit.sha },
          update: { $set: { ...commit, repositoryId: repo.id } },
          upsert: true,
        },
      }));
      await CommitModel.bulkWrite(commitOps);

      // Store pull requests
      const prOps = pullRequests.map((pr) => ({
        updateOne: {
          filter: { id: pr.id },
          update: { $set: { ...pr, repositoryId: repo.id } },
          upsert: true,
        },
      }));
      await PullRequestModel.bulkWrite(prOps);

      // Store issues
      const issueOps = issues.map((issue) => ({
        updateOne: {
          filter: { id: issue.id },
          update: { $set: { ...issue, repositoryId: repo.id } },
          upsert: true,
        },
      }));
      await IssueModel.bulkWrite(issueOps);
    }

    res.status(200).json({
      message:
        'Organization repositories and details fetched and stored successfully.',
    });
  } catch (error) {
    console.error('Error fetching organization repositories:', error.message);
    res
      .status(500)
      .json({ error: 'Failed to fetch organization repositories.' });
  }
};

const getRepoDetails = async (req, res) => {
  const { repoIdentifier } = req.params; // Can be repo ID or name

  try {
    const isNumeric = /^\d+$/.test(repoIdentifier); // Check if identifier is numeric (ID)
    const matchCondition = isNumeric
      ? { id: parseInt(repoIdentifier) } // Match by ID
      : { name: repoIdentifier }; // Match by name

    const repository = await RepositoryModel.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'commits', // Collection name for commits
          localField: 'id', // Repository ID
          foreignField: 'repositoryId', // Foreign key in commits
          as: 'commits', // Output array
        },
      },
      {
        $lookup: {
          from: 'pullrequests', // Collection name for pull requests
          localField: 'id', // Repository ID
          foreignField: 'repositoryId', // Foreign key in pull requests
          as: 'pullRequests', // Output array
        },
      },
      {
        $lookup: {
          from: 'issues', // Collection name for issues
          localField: 'id', // Repository ID
          foreignField: 'repositoryId', // Foreign key in issues
          as: 'issues', // Output array
        },
      },
    ]);

    if (!repository || repository.length === 0) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    res.status(200).json(repository[0]); // Return the first match
  } catch (error) {
    console.error('Error fetching repository details:', error.message);
    res.status(500).json({ error: 'Failed to fetch repository details.' });
  }
};
module.exports = {
  fetchRepoDetails,
  fetchOrgRepos,
  getRepoDetails,
};
