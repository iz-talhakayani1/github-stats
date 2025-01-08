const axios = require('axios');

const fetchGitHubData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch GitHub data');
  }
};

module.exports = { fetchGitHubData };
