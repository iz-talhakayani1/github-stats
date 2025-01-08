const mongoose = require('mongoose');

const pullRequestSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String },
  state: { type: String, enum: ['open', 'closed'] },
  created_at: { type: Date },
  updated_at: { type: Date },
  merged_at: { type: Date },
  user: {
    login: String,
    id: Number,
    avatar_url: String,
  },
  html_url: { type: String },
  repo_id: { type: Number }, // Reference to the repository
});

module.exports = mongoose.model('PullRequest', pullRequestSchema);
