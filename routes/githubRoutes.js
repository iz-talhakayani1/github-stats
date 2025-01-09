const express = require('express');
const {
  fetchRepoDetails,
  fetchOrgRepos,
  getRepoDetails,
} = require('../controllers/githubController');

const router = express.Router();

// Route to fetch and store details for a specific repository
router.post('/repo/:accountName/:repoName', fetchRepoDetails);

// Route to fetch and store all repositories and their details for an organization
router.post('/org/:accountName', fetchOrgRepos);

router.get('/repo/:repoIdentifier', getRepoDetails);

module.exports = router;
