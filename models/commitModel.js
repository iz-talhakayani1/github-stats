const mongoose = require('mongoose');
const { Schema } = mongoose;

const commitSchema = new Schema({
  sha: { type: String, required: true, unique: true }, // Commit SHA
  message: { type: String },
  author: {
    name: { type: String },
    email: { type: String },
    date: { type: Date },
  },
  committer: {
    name: { type: String },
    email: { type: String },
    date: { type: Date },
  },
  url: { type: String },
  repositoryId: { type: Number, ref: 'Repository', required: true }, // Reference to Repository ID
});

module.exports = mongoose.model('Commit', commitSchema);
