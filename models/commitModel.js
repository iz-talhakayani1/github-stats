const mongoose = require('mongoose');

const commitSchema = new mongoose.Schema({
  sha: { type: String },
  message: { type: String },
  author: {
    name: String,
    email: String,
    date: Date,
  },
  committer: {
    name: String,
    email: String,
    date: Date,
  },
  html_url: { type: String },
  repo_id: { type: Number }, // Reference to the repository
});

module.exports = mongoose.model('Commit', commitSchema);
