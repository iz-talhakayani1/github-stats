const mongoose = require('mongoose');
const { Schema } = mongoose;

const pullRequestSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // GitHub Pull Request ID
  number: { type: Number, required: true },
  state: { type: String },
  title: { type: String },
  user: {
    login: { type: String },
    id: { type: Number },
  },
  created_at: { type: Date },
  updated_at: { type: Date },
  closed_at: { type: Date },
  merged_at: { type: Date },
  repositoryId: { type: Number, ref: 'Repository', required: true }, // Reference to Repository ID
});

module.exports = mongoose.model('PullRequest', pullRequestSchema);
