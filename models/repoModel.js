const mongoose = require('mongoose');
const { Schema } = mongoose;

const repositorySchema = new Schema({
  id: { type: Number, required: true, unique: true }, // GitHub Repository ID
  name: { type: String, required: true },
  full_name: { type: String, required: true },
  html_url: { type: String, required: true },
  description: { type: String },
  language: { type: String },
  stargazers_count: { type: Number },
  forks_count: { type: Number },
  open_issues_count: { type: Number },
  created_at: { type: Date },
  updated_at: { type: Date },
  pushed_at: { type: Date },
});

module.exports = mongoose.model('Repo', repositorySchema);
