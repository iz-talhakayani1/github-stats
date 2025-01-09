const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // GitHub Issue ID
  number: { type: Number, required: true },
  title: { type: String },
  state: { type: String },
  user: {
    login: { type: String },
    id: { type: Number },
  },
  labels: [
    {
      id: { type: Number },
      name: { type: String },
      color: { type: String },
    },
  ],
  created_at: { type: Date },
  updated_at: { type: Date },
  closed_at: { type: Date },
  repositoryId: { type: Number, ref: 'Repository', required: true }, // Reference to Repository ID
});

module.exports = mongoose.model('Issue', issueSchema);
