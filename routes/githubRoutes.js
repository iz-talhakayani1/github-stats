const express = require('express');
const { getRepos, getRepoDetails } = require('../controllers/githubController');

const router = express.Router();

// API Routes
router.get('/:githubOrg/repos', getRepos);
router.get('/repo/:githubOrg/:repoName/details', getRepoDetails);

module.exports = router;
