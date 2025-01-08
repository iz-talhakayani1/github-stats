const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
  name: String,
  full_name: String,
  description: String,
  owner: Object,
  url: String,
});

module.exports = mongoose.model('Repo', repoSchema);
