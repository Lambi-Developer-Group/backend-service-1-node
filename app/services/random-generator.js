const express = require('express');
const router = express.Router();
const crypto = require('crypto');

function generate() {
  const randomBytes = crypto.randomBytes(16);
  const randomName = randomBytes.toString('hex');
  return randomName.substring(0, 8);
}

// function generate(originalName) {
//     const extension = originalName.split('.').pop();
//     const randomBytes = crypto.randomBytes(16);
//     const randomName = randomBytes.toString('hex') + '.' + extension;
//     return randomName;
// }

module.exports = generate;
